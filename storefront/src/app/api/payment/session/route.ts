import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://backend:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function POST(request: NextRequest) {
  try {
    const { provider_id } = await request.json()
    const cookieStore = await cookies()
    const cartId = cookieStore.get('medusa_cart_id')?.value

    if (!cartId) {
      return NextResponse.json(
        { error: 'No cart found' },
        { status: 404 }
      )
    }

    console.log("Creating payment collection and session with provider:", provider_id, "for cart:", cartId)

    // Step 1: Create Payment Collection for the cart (Medusa v2 approach)
    console.log("Step 1: Creating payment collection...")
    const paymentCollectionResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/payment-collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        cart_id: cartId,
      })
    })
    
    const paymentCollectionData = await paymentCollectionResponse.json()
    
    if (!paymentCollectionResponse.ok) {
      console.error("Failed to create payment collection:", paymentCollectionData)
      return NextResponse.json(
        { error: 'Failed to create payment collection', details: paymentCollectionData },
        { status: 500 }
      )
    }

    const paymentCollectionId = paymentCollectionData.payment_collection.id
    console.log("✅ Payment collection created:", paymentCollectionId)

    // Step 2: Create Payment Session within the collection
    console.log("Step 2: Creating payment session...")
    const paymentSessionResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/payment-collections/${paymentCollectionId}/payment-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        provider_id,
      })
    })
    
    const paymentSessionData = await paymentSessionResponse.json()
    
    if (!paymentSessionResponse.ok) {
      console.error("Failed to create payment session:", paymentSessionData)
      return NextResponse.json(
        { error: 'Failed to create payment session', details: paymentSessionData },
        { status: 500 }
      )
    }

    console.log("✅ Payment session created successfully")

    return NextResponse.json({ 
      success: true,
      payment_collection: paymentCollectionData.payment_collection,
      payment_session: paymentSessionData.payment_session
    })
  } catch (error) {
    console.error('Error in payment flow:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    )
  }
}