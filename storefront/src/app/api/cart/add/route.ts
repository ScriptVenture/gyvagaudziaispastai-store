import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://backend:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function POST(request: NextRequest) {
  try {
    const { variantId, quantity } = await request.json()
    const cookieStore = await cookies()
    let cartId = cookieStore.get('medusa_cart_id')?.value

    console.log("Add to cart API - Cart ID from cookie:", cartId)

    // Create cart if it doesn't exist
    if (!cartId) {
      console.log("Creating new cart...")
      
      // Get regions using direct API call
      const regionsResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/regions`, {
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
        },
      })
      
      const regionsData = await regionsResponse.json()
      const regions = regionsData.regions
      console.log("Available regions:", regions.map((r: any) => ({ id: r.id, name: r.name })))
      
      const europeRegion = regions.find((r: any) => r.name === "Europe")
      
      if (!europeRegion) {
        console.error("Available regions:", regions)
        throw new Error("No Europe region found")
      }
      
      console.log("Using region:", europeRegion.id, europeRegion.name)
      
      // Create cart with region_id using direct API call
      const createCartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          region_id: europeRegion.id
        })
      })
      
      const createCartData = await createCartResponse.json()
      cartId = createCartData.cart.id
      
      // Set cookie with proper options - ensure cartId is not undefined
      if (cartId) {
        cookieStore.set('medusa_cart_id', cartId, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          httpOnly: false,
          sameSite: 'lax',
          path: '/'
        })
        console.log("New cart created with ID:", cartId)
      } else {
        throw new Error("Failed to create cart - no cart ID returned")
      }
    }

    // Add item to cart using direct API call
    if (!cartId) {
      throw new Error("No cart ID available")
    }
    
    console.log("Adding item to cart:", { cartId, variantId, quantity })
    await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        variant_id: variantId,
        quantity,
      })
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

    console.log("Cart updated successfully, items:", cart.items.length)

    // Fix image URLs for Docker environment
    if (cart.items) {
      cart.items = cart.items.map((item: any) => ({
        ...item,
        thumbnail: item.thumbnail ? 
          `/api/image-proxy?url=${encodeURIComponent(item.thumbnail)}` 
          : null
      }))
    }

    return NextResponse.json({ 
      success: true, 
      cart,
      cartId 
    })
  } catch (error) {
    console.error('Error in add to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}