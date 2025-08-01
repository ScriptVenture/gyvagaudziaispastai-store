export const MEDUSA_BACKEND_URL = 
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export const MEDUSA_PUBLISHABLE_KEY = 
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export const IS_BROWSER = typeof window !== "undefined"