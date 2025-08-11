export const MEDUSA_BACKEND_URL = 
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export const MEDUSA_PUBLISHABLE_KEY = 
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

// Store API endpoint for public store operations
export const STORE_API_URL = "/store"

// Cart API endpoint for cart operations (uses server-side API routes)
export const CART_API_URL = "/api/cart"

export const IS_BROWSER = typeof window !== "undefined"