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
    const { email, shipping_address, billing_address } = await request.json()
    const cookieStore = await cookies()
    const cartId = cookieStore.get('medusa_cart_id')?.value

    if (!cartId) {
      return NextResponse.json(
        { error: 'No cart found' },
        { status: 404 }
      )
    }

    console.log("Updating cart addresses for cart:", cartId)

    // Update cart with addresses
    const updateData: any = {
      email,
      shipping_address: {
        first_name: shipping_address.firstName,
        last_name: shipping_address.lastName,
        address_1: shipping_address.address1,
        address_2: shipping_address.address2 || "",
        city: shipping_address.city,
        postal_code: shipping_address.postalCode,
        country_code: shipping_address.countryCode,
        province: shipping_address.province || "",
        phone: shipping_address.phone,
        company: shipping_address.company || "",
      }
    }

    // Add billing address if different from shipping
    if (billing_address && billing_address !== shipping_address) {
      updateData.billing_address = {
        first_name: billing_address.firstName,
        last_name: billing_address.lastName,
        address_1: billing_address.address1,
        address_2: billing_address.address2 || "",
        city: billing_address.city,
        postal_code: billing_address.postalCode,
        country_code: billing_address.countryCode,
        province: billing_address.province || "",
        phone: billing_address.phone,
        company: billing_address.company || "",
      }
    } else {
      // Use shipping address as billing address
      updateData.billing_address = updateData.shipping_address
    }

    console.log("Update data:", JSON.stringify(updateData, null, 2))
    
    // First verify the cart's region has Lithuania
    try {
      const { cart: currentCart } = await sdk.store.cart.retrieve(cartId, {
        fields: "*region,*region.countries"
      })
      
      console.log("Cart region:", currentCart.region?.id, currentCart.region?.name)
      if (currentCart.region?.countries) {
        const countryCodes = currentCart.region.countries.map((c: any) => c.iso_2)
        console.log("Region countries:", countryCodes)
        console.log("Has Lithuania:", countryCodes.includes("lt"))
      } else {
        console.log("⚠️  No countries found in cart region!")
      }
    } catch (retrieveError) {
      console.error("Error retrieving cart for verification:", retrieveError)
    }
    
    console.log("About to call sdk.store.cart.update...")
    
    try {
      await sdk.store.cart.update(cartId, updateData)
      console.log("✅ Cart update successful!")
    } catch (updateError) {
      console.error("❌ Cart update failed:", updateError)
      throw updateError
    }
    console.log("Cart update successful")

    // Retrieve updated cart
    const { cart } = await sdk.store.cart.retrieve(cartId, {
      fields: "*shipping_address,*billing_address,*email"
    })

    return NextResponse.json({ 
      success: true,
      cart
    })
  } catch (error: any) {
    console.error('Error updating cart addresses:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update cart addresses', 
        details: error?.message || 'Unknown error',
        stack: error?.stack
      },
      { status: 500 }
    )
  }
}