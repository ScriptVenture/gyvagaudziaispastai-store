"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"

interface CartContextType {
  cart: HttpTypes.StoreCart | null
  isLoading: boolean
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

async function fetchCart() {
  // Only fetch on client-side
  if (typeof window === 'undefined') {
    return null
  }
  
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
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  const refreshCart = useCallback(async () => {
    // Only run on client-side after mounting
    if (!mounted) {
      return
    }
    
    try {
      setIsLoading(true)
      const cartData = await fetchCart()
      setCart(cartData)
    } catch (error) {
      console.error("Error loading cart:", error)
    } finally {
      setIsLoading(false)
    }
  }, [mounted])

  useEffect(() => {
    if (mounted) {
      refreshCart()
    }
  }, [refreshCart, mounted])

  // Listen for cart updates (client-side only)
  useEffect(() => {
    const handleCartUpdate = () => {
      refreshCart()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('cart-updated', handleCartUpdate)
      return () => window.removeEventListener('cart-updated', handleCartUpdate)
    }
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