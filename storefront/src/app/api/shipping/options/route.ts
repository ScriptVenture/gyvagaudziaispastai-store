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

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const cartId = cookieStore.get('medusa_cart_id')?.value

    if (!cartId) {
      return NextResponse.json(
        { error: 'No cart found' },
        { status: 404 }
      )
    }

    console.log("Fetching shipping options for cart:", cartId)

    // Get shipping options for the cart
    const response = await sdk.client.fetch<{
      shipping_options: any[]
    }>(`/store/shipping-options`, {
      query: { cart_id: cartId },
      headers: {
        "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
      }
    })

    console.log("Shipping options:", response.shipping_options?.length || 0)

    return NextResponse.json({ 
      shipping_options: response.shipping_options || []
    })
  } catch (error) {
    console.error('Error fetching shipping options:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipping options' },
      { status: 500 }
    )
  }
}