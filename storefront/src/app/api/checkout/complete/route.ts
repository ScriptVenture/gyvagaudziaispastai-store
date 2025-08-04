import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import Medusa from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://backend:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: MEDUSA_PUBLISHABLE_KEY,
})

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

    // Complete the cart to create an order
    const result = await sdk.store.cart.complete(cartId)
    
    console.log("Cart completion result:", result.type)

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
      
      if (cart.payment_sessions && cart.payment_sessions.length > 0) {
        const paymentSession = cart.payment_sessions[0]
        
        // Check if this is a Paysera payment session with a payment URL
        if (paymentSession.data && paymentSession.data.payment_url) {
          return NextResponse.json({
            success: false,
            redirect_url: paymentSession.data.payment_url,
            message: 'Redirecting to payment gateway',
            cart: cart
          })
        }
      }

      return NextResponse.json({
        success: false,
        error: 'Order could not be completed. Payment may be required.',
        cart: cart
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