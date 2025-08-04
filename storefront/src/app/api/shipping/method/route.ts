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
    const { option_id } = await request.json()
    const cookieStore = await cookies()
    const cartId = cookieStore.get('medusa_cart_id')?.value

    if (!cartId) {
      return NextResponse.json(
        { error: 'No cart found' },
        { status: 404 }
      )
    }

    console.log("Setting shipping method:", option_id, "for cart:", cartId)

    // Add shipping method to cart
    await sdk.store.cart.addShippingMethod(cartId, {
      option_id,
    })

    // Retrieve updated cart
    const { cart } = await sdk.store.cart.retrieve(cartId, {
      fields: "*shipping_methods,*shipping_address"
    })

    return NextResponse.json({ 
      success: true,
      cart
    })
  } catch (error) {
    console.error('Error setting shipping method:', error)
    return NextResponse.json(
      { error: 'Failed to set shipping method' },
      { status: 500 }
    )
  }
}