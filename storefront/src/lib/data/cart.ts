"use server"

import { HttpTypes } from "@medusajs/types"
import { revalidatePath } from "next/cache"
import Medusa from "@medusajs/js-sdk"
import {
  getCartId,
  setCartId,
  removeCartId,
  getCountryCode,
} from "./cookies"

// Create SDK instance for server-side use
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://backend:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: MEDUSA_PUBLISHABLE_KEY,
})

export async function retrieveCart(cartId?: string) {
  const id = cartId || getCartId()
  
  if (!id) {
    console.log("No cart ID found")
    return null
  }

  try {
    console.log("Retrieving cart with ID:", id)
    const { cart } = await sdk.store.cart.retrieve(id, {
      fields: "*items,*items.product,*items.variant,*items.thumbnail,+items.total,*shipping_methods,*payment_collection,*payment_collection.payment_sessions"
    })
    console.log("Cart retrieved successfully:", cart?.items?.length || 0, "items")
    return cart
  } catch (error) {
    console.error("Error retrieving cart:", error)
    return null
  }
}

export async function getOrSetCart() {
  let cart = await retrieveCart()
  
  if (!cart) {
    const countryCode = getCountryCode()
    
    // Create a new cart
    const { cart: newCart } = await sdk.store.cart.create({
      region_id: undefined, // Will be set based on country
      sales_channel_id: undefined,
      metadata: {}
    })
    
    cart = newCart
    setCartId(cart.id)
  }
  
  return cart
}

export async function addToCart({
  variantId,
  quantity,
}: {
  variantId: string
  quantity: number
}) {
  console.log("Adding to cart:", { variantId, quantity })
  const cart = await getOrSetCart()
  
  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  console.log("Using cart ID:", cart.id)
  const result = await sdk.store.cart.createLineItem(cart.id, {
    variant_id: variantId,
    quantity,
  })
  console.log("Line item created successfully")
  
  revalidatePath("/cart")
  const updatedCart = await retrieveCart()
  console.log("Updated cart has", updatedCart?.items?.length || 0, "items")
  return updatedCart
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  const cartId = getCartId()
  
  if (!cartId) {
    throw new Error("No cart found")
  }

  await sdk.store.cart.updateLineItem(cartId, lineId, {
    quantity,
  })
  
  revalidatePath("/cart")
  return await retrieveCart()
}

export async function deleteLineItem(lineId: string) {
  const cartId = getCartId()
  
  if (!cartId) {
    throw new Error("No cart found")
  }

  await sdk.store.cart.deleteLineItem(cartId, lineId)
  
  revalidatePath("/cart")
  return await retrieveCart()
}

export async function updateCart(updates: HttpTypes.StoreUpdateCart) {
  const cartId = getCartId()
  
  if (!cartId) {
    throw new Error("No cart found")
  }

  const { cart } = await sdk.store.cart.update(cartId, updates)
  
  revalidatePath("/cart")
  return cart
}

export async function setShippingMethod(optionId: string) {
  const cartId = getCartId()
  
  if (!cartId) {
    throw new Error("No cart found")
  }

  await sdk.store.cart.addShippingMethod(cartId, {
    option_id: optionId,
  })
  
  revalidatePath("/cart")
  return await retrieveCart()
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  providerId: string
) {
  return await sdk.store.payment.initiatePaymentSession(cart, {
    provider_id: providerId,
  })
}

export async function completeCart() {
  const cartId = getCartId()
  
  if (!cartId) {
    throw new Error("No cart found")
  }

  try {
    const result = await sdk.store.cart.complete(cartId)
    
    if (result.type === "order") {
      removeCartId()
      return result.order
    }
    
    return null
  } catch (error) {
    console.error("Error completing cart:", error)
    throw error
  }
}