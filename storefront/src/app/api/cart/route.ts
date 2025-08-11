import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://backend:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || process.env.MEDUSA_PUBLISHABLE_KEY || ""

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const cartId = cookieStore.get('medusa_cart_id')?.value
    
    console.log("Cart API - Getting cart with ID:", cartId)
    
    if (!cartId) {
      return NextResponse.json({ cart: null })
    }

    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}?fields=*items,*items.product,*items.variant,*items.thumbnail,+items.total,*region,*region.payment_providers`, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.status}`)
    }
    
    const data = await response.json()
    const cart = data.cart
    
    console.log("Cart API - Retrieved cart with", cart.items.length, "items")
    
    // Log the first item's price to debug
    if (cart.items.length > 0) {
      console.log("First item price info:", {
        unit_price: cart.items[0].unit_price,
        quantity: cart.items[0].quantity,
        total: cart.items[0].total
      })
    }
    
    // Fix image URLs for Docker environment
    if (cart.items) {
      cart.items = cart.items.map((item: any) => {
        console.log("Original thumbnail URL:", item.thumbnail)
        const newThumbnail = item.thumbnail ? 
          `/api/image-proxy?url=${encodeURIComponent(item.thumbnail)}` 
          : null
        console.log("Proxied thumbnail URL:", newThumbnail)
        return {
          ...item,
          thumbnail: newThumbnail
        }
      })
    }
    
    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json({ cart: null })
  }
}