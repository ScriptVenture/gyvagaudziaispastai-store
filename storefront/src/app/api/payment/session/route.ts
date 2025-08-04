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
    const { provider_id } = await request.json()
    const cookieStore = await cookies()
    const cartId = cookieStore.get('medusa_cart_id')?.value

    if (!cartId) {
      return NextResponse.json(
        { error: 'No cart found' },
        { status: 404 }
      )
    }

    console.log("Creating payment session with provider:", provider_id, "for cart:", cartId)

    // Initialize payment sessions for the cart
    const response = await sdk.store.cart.initializePaymentSession(cartId, {
      provider_id,
    })

    console.log("Payment session created successfully")

    return NextResponse.json({ 
      success: true,
      cart: response.cart
    })
  } catch (error) {
    console.error('Error creating payment session:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    )
  }
}