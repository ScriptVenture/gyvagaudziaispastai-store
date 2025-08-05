import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://backend:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

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

    // Add shipping method to cart using direct API call
    await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/shipping-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ option_id })
    })

    // Retrieve updated cart using direct API call
    const cartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}?fields=*shipping_methods,*shipping_address`, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
    })
    
    const cartData = await cartResponse.json()
    const cart = cartData.cart

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