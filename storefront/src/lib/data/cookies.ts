import Cookies from "js-cookie"

const CART_ID_COOKIE = "medusa_cart_id"
const REGION_COOKIE = "medusa_region"
const COUNTRY_COOKIE = "medusa_country"

export function getCartId() {
  const cartId = Cookies.get(CART_ID_COOKIE)
  console.log("Getting cart ID from cookie:", cartId)
  return cartId
}

export function setCartId(cartId: string) {
  console.log("Setting cart ID in cookie:", cartId)
  Cookies.set(CART_ID_COOKIE, cartId, { expires: 7, sameSite: 'lax' })
}

export function removeCartId() {
  console.log("Removing cart ID from cookie")
  Cookies.remove(CART_ID_COOKIE)
}

export function getRegion() {
  return Cookies.get(REGION_COOKIE)
}

export function setRegion(regionId: string) {
  Cookies.set(REGION_COOKIE, regionId, { expires: 30 })
}

export function getCountryCode() {
  return Cookies.get(COUNTRY_COOKIE) || "us"
}

export function setCountryCode(countryCode: string) {
  Cookies.set(COUNTRY_COOKIE, countryCode, { expires: 30 })
}

// For server-side data fetching
export async function getAuthHeaders() {
  // Add any auth headers if needed
  return {}
}

export async function getCacheOptions(tag: string) {
  return {
    tags: [tag],
  }
}

export async function getCacheTag(tag: string) {
  return tag
}