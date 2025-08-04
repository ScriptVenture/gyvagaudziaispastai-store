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
    const { lineId } = await request.json()
    const cookieStore = await cookies()
    const cartId = cookieStore.get('medusa_cart_id')?.value

    if (!cartId) {
      return NextResponse.json(
        { error: 'No cart found' },
        { status: 404 }
      )
    }

    await sdk.store.cart.deleteLineItem(cartId, lineId)

    const { cart } = await sdk.store.cart.retrieve(cartId, {
      fields: "*items,*items.product,*items.variant,*items.thumbnail"
    })

    // Fix image URLs for Docker environment
    if (cart.items) {
      cart.items = cart.items.map((item: any) => ({
        ...item,
        thumbnail: item.thumbnail ? 
          `/api/image-proxy?url=${encodeURIComponent(item.thumbnail)}` 
          : null
      }))
    }

    return NextResponse.json({ success: true, cart })
  } catch (error) {
    console.error('Error deleting from cart:', error)
    return NextResponse.json(
      { error: 'Failed to delete from cart' },
      { status: 500 }
    )
  }
}