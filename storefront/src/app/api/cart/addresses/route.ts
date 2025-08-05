import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://backend:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function POST(request: NextRequest) {
  try {
    const { email, shipping_address, billing_address } = await request.json()
    const cookieStore = await cookies()
    let cartId = cookieStore.get('medusa_cart_id')?.value

    if (!cartId) {
      return NextResponse.json(
        { error: 'No cart found' },
        { status: 404 }
      )
    }

    console.log("Updating cart addresses for cart:", cartId)
    
    // First, check if the cart has a valid region, sales channel, and customer
    try {
      const cartCheckResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}?fields=*region,*sales_channel,*customer`, {
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
        },
      })
      
      const cartCheckData = await cartCheckResponse.json()
      const fixUpdates: any = {}
      
      console.log("Cart check data:", {
        cart_id: cartCheckData.cart?.id,
        sales_channel_id: cartCheckData.cart?.sales_channel_id,
        sales_channel: cartCheckData.cart?.sales_channel,
        region_id: cartCheckData.cart?.region_id,
        region: cartCheckData.cart?.region,
        customer_id: cartCheckData.cart?.customer_id,
        customer: cartCheckData.cart?.customer
      })
      
      // Check and fix region
      if (!cartCheckData.cart.region) {
        console.log("⚠️  Cart has invalid region, will update to Europe region...")
        
        const regionsResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/regions`, {
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
          },
        })
        
        const regionsData = await regionsResponse.json()
        const europeRegion = regionsData.regions.find((r: any) => r.name === "Europe")
        
        if (europeRegion) {
          fixUpdates.region_id = europeRegion.id
          console.log("✅ Will update cart region to:", europeRegion.id)
        }
      }
      
      // Check for invalid customer reference
      if (cartCheckData.cart.customer_id && !cartCheckData.cart.customer) {
        console.log("⚠️  Cart has invalid customer ID (" + cartCheckData.cart.customer_id + "), need to recreate cart...")
        
        // If customer is invalid, recreate the cart (similar to sales channel fix)
        // Get current cart items first
        const currentCartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}?fields=*items,*items.variant`, {
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
          },
        })
        
        const currentCartData = await currentCartResponse.json()
        const cartItems = currentCartData.cart.items || []
        
        // Get regions to find Europe region
        const regionsResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/regions`, {
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
          },
        })
        
        const regionsData = await regionsResponse.json()
        const europeRegion = regionsData.regions.find((r: any) => r.name === "Europe")
        
        if (europeRegion) {
          console.log("Creating new cart without invalid customer...")
          
          // Create new cart with proper address format (no customer_id)
          const createCartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({
              region_id: europeRegion.id,
              email,
              shipping_address: {
                first_name: shipping_address.firstName,
                last_name: shipping_address.lastName,
                address_1: shipping_address.address1,
                city: shipping_address.city,
                postal_code: shipping_address.postalCode,
                country_code: shipping_address.countryCode.toLowerCase(),
                ...(shipping_address.address2 && { address_2: shipping_address.address2 }),
                ...(shipping_address.province && { province: shipping_address.province }),
                ...(shipping_address.phone && { phone: shipping_address.phone }),
                ...(shipping_address.company && { company: shipping_address.company }),
              },
              billing_address: billing_address && billing_address !== shipping_address ? {
                first_name: billing_address.firstName,
                last_name: billing_address.lastName,
                address_1: billing_address.address1,
                city: billing_address.city,
                postal_code: billing_address.postalCode,
                country_code: billing_address.countryCode.toLowerCase(),
                ...(billing_address.address2 && { address_2: billing_address.address2 }),
                ...(billing_address.province && { province: billing_address.province }),
                ...(billing_address.phone && { phone: billing_address.phone }),
                ...(billing_address.company && { company: billing_address.company }),
              } : {
                first_name: shipping_address.firstName,
                last_name: shipping_address.lastName,
                address_1: shipping_address.address1,
                city: shipping_address.city,
                postal_code: shipping_address.postalCode,
                country_code: shipping_address.countryCode.toLowerCase(),
                ...(shipping_address.address2 && { address_2: shipping_address.address2 }),
                ...(shipping_address.province && { province: shipping_address.province }),
                ...(shipping_address.phone && { phone: shipping_address.phone }),
                ...(shipping_address.company && { company: shipping_address.company }),
              }
            })
          })
          
          const newCartData = await createCartResponse.json()
          
          if (!createCartResponse.ok) {
            console.error("Failed to create new cart:", newCartData)
            throw new Error(`Failed to create new cart: ${JSON.stringify(newCartData)}`)
          }
          
          const newCartId = newCartData.cart.id
          
          // Re-add items to new cart
          for (const item of cartItems) {
            await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${newCartId}/line-items`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
              },
              body: JSON.stringify({
                variant_id: item.variant_id,
                quantity: item.quantity,
              })
            })
          }
          
          // Update cart ID
          cartId = newCartId
          cookieStore.set('medusa_cart_id', cartId, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: false,
            sameSite: 'lax',
            path: '/'
          })
          
          console.log("✅ New cart created without customer reference:", newCartId)
          
          // Get updated cart and return success
          const finalCartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}?fields=*shipping_address,*billing_address,*email,*region,*region.payment_providers`, {
            headers: {
              'Content-Type': 'application/json',
              'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
            },
          })
          
          const finalCartData = await finalCartResponse.json()
          
          return NextResponse.json({ 
            success: true,
            cart: finalCartData.cart
          })
        }
      }
      
      // Check and fix sales channel
      const salesChannelId = cartCheckData.cart.sales_channel_id || cartCheckData.cart.sales_channel?.id
      if (!cartCheckData.cart.sales_channel || salesChannelId === "sc_01K1GB4PATDWHHTN2MMGFZ1MPK") {
        console.log("⚠️  Cart has invalid sales channel (" + salesChannelId + "), need to recreate cart...")
        
        // If the sales channel is invalid, it's better to create a new cart
        // Get current cart items first
        const currentCartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}?fields=*items,*items.variant`, {
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
          },
        })
        
        const currentCartData = await currentCartResponse.json()
        const cartItems = currentCartData.cart.items || []
        
        // Get regions to find Europe region
        const regionsResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/regions`, {
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
          },
        })
        
        const regionsData = await regionsResponse.json()
        const europeRegion = regionsData.regions.find((r: any) => r.name === "Europe")
        
        if (europeRegion) {
          console.log("Creating new cart with valid region...")
          
          // Create new cart with proper address format
          const createCartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({
              region_id: europeRegion.id,
              email,
              shipping_address: {
                first_name: shipping_address.firstName,
                last_name: shipping_address.lastName,
                address_1: shipping_address.address1,
                city: shipping_address.city,
                postal_code: shipping_address.postalCode,
                country_code: shipping_address.countryCode.toLowerCase(),
                ...(shipping_address.address2 && { address_2: shipping_address.address2 }),
                ...(shipping_address.province && { province: shipping_address.province }),
                ...(shipping_address.phone && { phone: shipping_address.phone }),
                ...(shipping_address.company && { company: shipping_address.company }),
              },
              billing_address: billing_address && billing_address !== shipping_address ? {
                first_name: billing_address.firstName,
                last_name: billing_address.lastName,
                address_1: billing_address.address1,
                city: billing_address.city,
                postal_code: billing_address.postalCode,
                country_code: billing_address.countryCode.toLowerCase(),
                ...(billing_address.address2 && { address_2: billing_address.address2 }),
                ...(billing_address.province && { province: billing_address.province }),
                ...(billing_address.phone && { phone: billing_address.phone }),
                ...(billing_address.company && { company: billing_address.company }),
              } : {
                first_name: shipping_address.firstName,
                last_name: shipping_address.lastName,
                address_1: shipping_address.address1,
                city: shipping_address.city,
                postal_code: shipping_address.postalCode,
                country_code: shipping_address.countryCode.toLowerCase(),
                ...(shipping_address.address2 && { address_2: shipping_address.address2 }),
                ...(shipping_address.province && { province: shipping_address.province }),
                ...(shipping_address.phone && { phone: shipping_address.phone }),
                ...(shipping_address.company && { company: shipping_address.company }),
              }
            })
          })
          
          const newCartData = await createCartResponse.json()
          
          if (!createCartResponse.ok) {
            console.error("Failed to create new cart:", newCartData)
            throw new Error(`Failed to create new cart: ${JSON.stringify(newCartData)}`)
          }
          
          const newCartId = newCartData.cart.id
          
          // Re-add items to new cart
          for (const item of cartItems) {
            await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${newCartId}/line-items`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
              },
              body: JSON.stringify({
                variant_id: item.variant_id,
                quantity: item.quantity,
              })
            })
          }
          
          // Update cart ID
          cartId = newCartId
          cookieStore.set('medusa_cart_id', cartId, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: false,
            sameSite: 'lax',
            path: '/'
          })
          
          console.log("✅ New cart created with ID:", newCartId)
          
          // Get updated cart and return success
          const finalCartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}?fields=*shipping_address,*billing_address,*email,*region,*region.payment_providers`, {
            headers: {
              'Content-Type': 'application/json',
              'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
            },
          })
          
          const finalCartData = await finalCartResponse.json()
          
          return NextResponse.json({ 
            success: true,
            cart: finalCartData.cart
          })
        }
      }
      
      // Apply fixes if needed
      if (Object.keys(fixUpdates).length > 0) {
        await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
          },
          body: JSON.stringify(fixUpdates)
        })
        console.log("✅ Cart region/sales channel fixes applied")
      }
    } catch (regionError) {
      console.error("Error checking/fixing cart region/sales channel:", regionError)
    }

    // Update cart with addresses - strict Medusa v2 format (only valid fields)
    const updateData = {
      email,
      shipping_address: {
        first_name: shipping_address.firstName,
        last_name: shipping_address.lastName,
        address_1: shipping_address.address1,
        city: shipping_address.city,
        postal_code: shipping_address.postalCode,
        country_code: shipping_address.countryCode.toLowerCase(),
        ...(shipping_address.address2 && { address_2: shipping_address.address2 }),
        ...(shipping_address.province && { province: shipping_address.province }),
        ...(shipping_address.phone && { phone: shipping_address.phone }),
        ...(shipping_address.company && { company: shipping_address.company }),
      },
      billing_address: billing_address && billing_address !== shipping_address ? {
        first_name: billing_address.firstName,
        last_name: billing_address.lastName,
        address_1: billing_address.address1,
        city: billing_address.city,
        postal_code: billing_address.postalCode,
        country_code: billing_address.countryCode.toLowerCase(),
        ...(billing_address.address2 && { address_2: billing_address.address2 }),
        ...(billing_address.province && { province: billing_address.province }),
        ...(billing_address.phone && { phone: billing_address.phone }),
        ...(billing_address.company && { company: billing_address.company }),
      } : {
        first_name: shipping_address.firstName,
        last_name: shipping_address.lastName,
        address_1: shipping_address.address1,
        city: shipping_address.city,
        postal_code: shipping_address.postalCode,
        country_code: shipping_address.countryCode.toLowerCase(),
        ...(shipping_address.address2 && { address_2: shipping_address.address2 }),
        ...(shipping_address.province && { province: shipping_address.province }),
        ...(shipping_address.phone && { phone: shipping_address.phone }),
        ...(shipping_address.company && { company: shipping_address.company }),
      }
    }

    console.log("Update data:", JSON.stringify(updateData, null, 2))
    
    // First verify the cart's region has Lithuania
    try {
      const currentCartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}?fields=*region,*region.countries`, {
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
        },
      })
      
      const currentCartData = await currentCartResponse.json()
      const currentCart = currentCartData.cart
      
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
      const updateResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
        },
        body: JSON.stringify(updateData)
      })
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json()
        throw new Error(`Cart update failed: ${JSON.stringify(errorData)}`)
      }
      
      console.log("✅ Cart update successful!")
    } catch (updateError) {
      console.error("❌ Cart update failed:", updateError)
      throw updateError
    }
    console.log("Cart update successful")

    // Retrieve updated cart using direct API call
    const cartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}?fields=*shipping_address,*billing_address,*email,*region,*region.payment_providers`, {
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