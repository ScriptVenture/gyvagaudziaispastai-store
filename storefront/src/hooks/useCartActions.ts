import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { CART_API_URL, MEDUSA_PUBLISHABLE_KEY } from "@/lib/config"

export function useCartActions() {
  const { refreshCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const triggerCartUpdate = () => {
    window.dispatchEvent(new Event('cart-updated'))
  }

  const addItem = async (variantId: string, quantity: number = 1) => {
    try {
      setIsAdding(true)
      
      const response = await fetch(`${CART_API_URL}/add`, {
        method: 'POST',
        headers: {
          'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ variantId, quantity }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to cart')
      }

      // Cart ID is already set by the server-side API

      triggerCartUpdate()
      await refreshCart()
    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    } finally {
      setIsAdding(false)
    }
  }

  const updateItem = async (lineId: string, quantity: number) => {
    try {
      setIsUpdating(true)
      
      const response = await fetch(`${CART_API_URL}/update`, {
        method: 'POST',
        headers: {
          'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineId, quantity }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update cart')
      }

      triggerCartUpdate()
      await refreshCart()
    } catch (error) {
      console.error("Error updating cart:", error)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteItem = async (lineId: string) => {
    try {
      setIsDeleting(true)
      
      const response = await fetch(`${CART_API_URL}/delete`, {
        method: 'POST',
        headers: {
          'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineId }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete from cart')
      }

      triggerCartUpdate()
      await refreshCart()
    } catch (error) {
      console.error("Error deleting from cart:", error)
      throw error
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    addItem,
    updateItem,
    deleteItem,
    isAdding,
    isUpdating,
    isDeleting,
  }
}