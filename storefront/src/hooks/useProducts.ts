"use client"

import { useState, useEffect } from "react"
import { getProducts, getProductsByCategory } from "@/lib/medusa"

export interface Product {
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  variants: Array<{
    id: string
    title: string
    prices: Array<{
      amount: number
      currency_code: string
    }>
  }>
  categories?: Array<{
    id: string
    name: string
  }>
  tags?: Array<{
    value: string
  }>
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const fetchedProducts = await getProducts()
        setProducts(fetchedProducts)
      } catch (err) {
        setError("Failed to fetch products")
        console.error("Products fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}

export function useBestsellers() {
  const [bestsellers, setBestsellers] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBestsellers() {
      try {
        setLoading(true)
        const allProducts = await getProducts()
        // Filter products that have "bestseller" tag or specific SKUs
        const bestsellerProducts = allProducts.filter((product: Product) => 
          product.tags?.some(tag => tag.value === "bestseller") ||
          product.variants?.some(variant => 
            ["XL32-STANDART", "M24-STANDART", "S18-VOVERE", "XXL42-DVIGUBA"].includes(variant.title)
          )
        ).slice(0, 4) // Take only first 4
        
        setBestsellers(bestsellerProducts)
      } catch (err) {
        setError("Failed to fetch bestsellers")
        console.error("Bestsellers fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBestsellers()
  }, [])

  return { bestsellers, loading, error }
}