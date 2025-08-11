import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://backend:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || process.env.MEDUSA_PUBLISHABLE_KEY || ""

export async function POST(request: NextRequest) {
  try {
    const { lineId, quantity } = await request.json()
    const cookieStore = await cookies()
    const cartId = cookieStore.get('medusa_cart_id')?.value

    if (!cartId) {
      return NextResponse.json(
        { error: 'No cart found' },
        { status: 404 }
      )
    }

    // Update line item using direct API call
    await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${lineId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ quantity })
    })

    // Retrieve updated cart using direct API call
    const cartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}?fields=*items,*items.product,*items.variant,*items.thumbnail`, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
    })
    
    const cartData = await cartResponse.json()
    const cart = cartData.cart

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
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}