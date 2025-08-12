"use client"

import { useState, useEffect } from "react"
import { getCategories } from "@/lib/medusa"

export interface Category {
  id: string
  name: string
  description?: string
  handle: string
  parent_category_id?: string
  rank?: number
  is_active: boolean
  is_internal: boolean
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const fetchedCategories = await getCategories()
      setCategories(fetchedCategories)
    } catch (err) {
      setError("Failed to fetch categories")
      console.error("Categories fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return { categories, loading, error, refetch: fetchCategories }
}
