import { MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY } from "./config"

// Simple fetch wrapper for Medusa API
async function medusaRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${MEDUSA_BACKEND_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(MEDUSA_PUBLISHABLE_KEY && {
        "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
      }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json()
}

// Get all products
export async function getProducts(limit = 20) {
  try {
    const data = await medusaRequest(`/store/products?limit=${limit}`)
    return data.products || []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

// Get products by category
export async function getProductsByCategory(categoryId: string) {
  try {
    const data = await medusaRequest(`/store/products?category_id[]=${categoryId}`)
    return data.products || []
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}

// Get categories
export async function getCategories() {
  try {
    const data = await medusaRequest("/store/product-categories")
    return data.product_categories || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}