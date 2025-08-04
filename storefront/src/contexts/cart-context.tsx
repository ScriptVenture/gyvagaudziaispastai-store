"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import { getCartId } from "@/lib/data/cookies"

interface CartContextType {
  cart: HttpTypes.StoreCart | null
  isLoading: boolean
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

async function fetchCart() {
  try {
    const response = await fetch('/api/cart')
    if (!response.ok) return null
    const data = await response.json()
    return data.cart
  } catch (error) {
    console.error("Error fetching cart:", error)
    return null
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true)
      const cartData = await fetchCart()
      setCart(cartData)
    } catch (error) {
      console.error("Error loading cart:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      refreshCart()
    }

    window.addEventListener('cart-updated', handleCartUpdate)
    return () => window.removeEventListener('cart-updated', handleCartUpdate)
  }, [refreshCart])

  return (
    <CartContext.Provider value={{ cart, isLoading, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}