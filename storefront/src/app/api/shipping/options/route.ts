import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://backend:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

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

    // First, get cart details to debug what might be wrong
    const cartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}?fields=*shipping_address,*region,*sales_channel`, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
    })
    
    const cartData = await cartResponse.json()
    console.log("Cart details for shipping:", {
      id: cartData.cart?.id,
      region: cartData.cart?.region?.name,
      region_id: cartData.cart?.region_id,
      sales_channel: cartData.cart?.sales_channel?.name,
      sales_channel_id: cartData.cart?.sales_channel_id,
      has_shipping_address: !!cartData.cart?.shipping_address,
      country_code: cartData.cart?.shipping_address?.country_code
    })

    // Get shipping options for the cart using direct API call
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/shipping-options?cart_id=${cartId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
    })
    
    const data = await response.json()
    
    console.log("Shipping options response:", {
      status: response.status,
      options_count: data.shipping_options?.length || 0,
      error: data.error || data.message,
      full_response: data
    })

    // Debug: Log the first shipping option structure to help identify price fields
    if (data.shipping_options && data.shipping_options.length > 0) {
      console.log("First shipping option structure:", JSON.stringify(data.shipping_options[0], null, 2))
      
      // Log all possible price fields to help identify the issue
      const firstOption = data.shipping_options[0]
      console.log("Price field analysis:", {
        "option.amount": firstOption.amount,
        "option.price": firstOption.price,
        "option.calculated_amount": firstOption.calculated_amount,
        "option.calculated_price": firstOption.calculated_price,
        "option.cost": firstOption.cost,
        "typeof amount": typeof firstOption.amount,
        "isNaN amount": isNaN(firstOption.amount),
        "option keys": Object.keys(firstOption)
      })
    }

    return NextResponse.json({ 
      shipping_options: data.shipping_options || []
    })
  } catch (error) {
    console.error('Error fetching shipping options:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipping options' },
      { status: 500 }
    )
  }
}