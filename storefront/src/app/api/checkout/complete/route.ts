import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://backend:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const cartId = cookieStore.get('medusa_cart_id')?.value

    if (!cartId) {
      return NextResponse.json(
        { error: 'No cart found' },
        { status: 404 }
      )
    }

    console.log("Completing cart with ID:", cartId)

    // First, check the cart and its payment sessions (using correct Medusa v2 fields)
    const cartCheckResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}?fields=*payment_collection,*payment_collection.payment_sessions`, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
    })
    
    if (!cartCheckResponse.ok) {
      console.error("Failed to fetch cart details:", cartCheckResponse.status)
      const errorData = await cartCheckResponse.json()
      console.error("Cart fetch error:", errorData)
      return NextResponse.json(
        { error: 'Failed to fetch cart details for completion' },
        { status: 500 }
      )
    }
    
    const cartCheckData = await cartCheckResponse.json()
    console.log("Cart before completion:", {
      cart_id: cartCheckData.cart?.id,
      has_payment_collection: !!cartCheckData.cart?.payment_collection,
      payment_collection_id: cartCheckData.cart?.payment_collection?.id,
      payment_sessions_count: cartCheckData.cart?.payment_collection?.payment_sessions?.length || 0,
      payment_sessions: cartCheckData.cart?.payment_collection?.payment_sessions?.map((ps: any) => ({
        id: ps.id,
        provider_id: ps.provider_id,
        status: ps.status,
        data_keys: Object.keys(ps.data || {})
      }))
    })

    // Before completing, check if we have a payment session that needs authorization
    const paymentCollection = cartCheckData.cart?.payment_collection
    const paymentSessions = paymentCollection?.payment_sessions || []
    
    console.log("Found payment sessions before completion:", paymentSessions.length)
    
    if (paymentSessions.length > 0) {
      const paymentSession = paymentSessions[0]
      
      console.log("Payment session details:", {
        id: paymentSession.id,
        provider_id: paymentSession.provider_id,
        status: paymentSession.status,
        has_payment_url: !!paymentSession.data?.payment_url
      })
      
      // If we have a Paysera payment session, don't complete the cart yet
      // Instead, return the payment URL for redirect
      if (paymentSession.provider_id === 'pp_paysera_paysera' && paymentSession.status === 'pending') {
        const paymentUrl = paymentSession.data?.payment_url
        
        if (paymentUrl) {
          console.log("🚀 Redirecting to Paysera payment URL:", paymentUrl)
          return NextResponse.json({
            success: false,
            redirect_url: paymentUrl,
            message: 'Redirecting to payment gateway',
            cart: cartCheckData.cart
          })
        } else {
          console.log("❌ No payment URL found in Paysera session data")
        }
      } else {
        console.log("Payment session is not Paysera or not pending:", {
          provider: paymentSession.provider_id,
          status: paymentSession.status
        })
      }
    } else {
      console.log("❌ No payment sessions found before completion - this shouldn't happen!")
    }

    // Complete the cart to create an order using direct API call
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
    })
    
    const result = await response.json()
    
    console.log("Cart completion response:", {
      status: response.status,
      type: result.type,
      error: result.error || result.message,
      full_result: result
    })

    if (result.type === 'order') {
      // Order was successfully created
      console.log("Order created:", result.order.id)
      
      // Clear the cart cookie after successful order
      cookieStore.delete('medusa_cart_id')

      return NextResponse.json({ 
        success: true,
        order: {
          id: result.order.id,
          display_id: result.order.display_id,
          created_at: result.order.created_at,
          total: result.order.total,
          currency_code: result.order.currency_code,
          email: result.order.email,
          // Add more order details as needed
        }
      })
    } else {
      // Cart completion didn't result in an order (might need payment)
      // Check if this is a Paysera payment that needs redirect
      const cart = result.cart
      
      console.log("Cart completion did not create order, checking for payment sessions...")
      
      // Check for payment collection and sessions (Medusa v2 structure)
      let paymentSessions = []
      if (cart.payment_collection && cart.payment_collection.payment_sessions) {
        paymentSessions = cart.payment_collection.payment_sessions
      } else if (cart.payment_sessions) {
        // Fallback to legacy structure
        paymentSessions = cart.payment_sessions
      }
      
      console.log("Found payment sessions:", paymentSessions.length)
      
      if (paymentSessions && paymentSessions.length > 0) {
        const paymentSession = paymentSessions[0]
        
        console.log("Payment session details:", {
          id: paymentSession.id,
          provider_id: paymentSession.provider_id,
          status: paymentSession.status,
          data_keys: Object.keys(paymentSession.data || {})
        })
        
        // Check if this is a Paysera payment session with a payment URL
        if (paymentSession.data && (paymentSession.data.payment_url || paymentSession.data.redirect_url)) {
          const redirectUrl = paymentSession.data.payment_url || paymentSession.data.redirect_url
          console.log("Found Paysera redirect URL:", redirectUrl)
          
          return NextResponse.json({
            success: false,
            redirect_url: redirectUrl,
            message: 'Redirecting to payment gateway',
            cart: cart
          })
        }
      }

      return NextResponse.json({
        success: false,
        error: 'Order could not be completed. Payment may be required.',
        cart: cart,
        message: `Cart completion resulted in type: ${result.type}, but no payment redirect found`
      })
    }
  } catch (error) {
    console.error('Error completing order:', error)
    return NextResponse.json(
      { error: 'Failed to complete order' },
      { status: 500 }
    )
  }
}