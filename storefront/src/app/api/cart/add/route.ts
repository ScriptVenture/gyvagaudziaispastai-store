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
    const { variantId, quantity } = await request.json()
    const cookieStore = await cookies()
    let cartId = cookieStore.get('medusa_cart_id')?.value

    console.log("Add to cart API - Cart ID from cookie:", cartId)

    // Create cart if it doesn't exist
    if (!cartId) {
      console.log("Creating new cart...")
      
      // Get the Europe region - following official MedusaJS pattern
      const { regions } = await sdk.store.region.list()
      console.log("Available regions:", regions.map(r => ({ id: r.id, name: r.name })))
      
      const europeRegion = regions.find(r => r.name === "Europe")
      
      if (!europeRegion) {
        console.error("Available regions:", regions)
        throw new Error("No Europe region found")
      }
      
      console.log("Using region:", europeRegion.id, europeRegion.name)
      
      // Create cart with region_id only (following official starter pattern)
      const { cart } = await sdk.store.cart.create({
        region_id: europeRegion.id
      })
      cartId = cart.id
      
      // Set cookie with proper options
      cookieStore.set('medusa_cart_id', cartId, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: false,
        sameSite: 'lax',
        path: '/'
      })
      console.log("New cart created with ID:", cartId)
    }

    // Add item to cart
    console.log("Adding item to cart:", { cartId, variantId, quantity })
    await sdk.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
    })

    // Retrieve updated cart
    const { cart } = await sdk.store.cart.retrieve(cartId, {
      fields: "*items,*items.product,*items.variant,*items.thumbnail"
    })

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