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

// Get all products with optional category filter
export async function getProducts(limit = 20, categoryId?: string) {
  try {
    let url = `/store/products?limit=${limit}`
    if (categoryId) {
      url += `&category_id=${categoryId}`
    }
    const data = await medusaRequest(url)
    return data.products || []
  } catch (error) {
    // Error logging removed to avoid exposing API details
    return []
  }
}

// Get single product by handle or id
export async function getProduct(handleOrId: string) {
  try {
    // Debug logging removed for security
    
    // Get all products and filter by handle client-side
    // since MedusaJS doesn't support handle filtering via query params
    const data = await medusaRequest(`/store/products?fields=*,images.*,variants.*,variants.prices.*,categories.*`);
    
    if (data.products && data.products.length > 0) {
      // Filter by exact handle match
      const productByHandle = data.products.find((product: any) => product.handle === handleOrId);
      
      if (productByHandle) {
        return productByHandle;
      }
      
      // If no product found by handle, try by ID as fallback
      const productById = data.products.find((product: any) => product.id === handleOrId);
      if (productById) {
        return productById;
      }
    }
    
    return null;
  } catch (error) {
    // Error logging removed to avoid exposing API details
    return null
  }
}

// Get products by category
export async function getProductsByCategory(categoryId: string) {
  try {
    const data = await medusaRequest(`/store/products?category_id[]=${categoryId}`)
    return data.products || []
  } catch (error) {
    // Error logging removed to avoid exposing API details
    return []
  }
}

// Get categories
export async function getCategories() {
  try {
    const data = await medusaRequest("/store/product-categories")
    return data.product_categories || []
  } catch (error) {
    // Error logging removed to avoid exposing API details
    return []
  }
}

// Cart Management
export async function createCart() {
  try {
    const data = await medusaRequest("/store/cart", {
      method: "POST"
    })
    return data.cart
  } catch (error) {
    // Error logging removed to avoid exposing API details
    return null
  }
}

export async function getCart(cartId: string) {
  try {
    const data = await medusaRequest(`/store/cart?cart_id=${cartId}`)
    return data.cart
  } catch (error) {
    // Error logging removed to avoid exposing API details
    return null
  }
}

export async function addToCart(cartId: string, variantId: string, quantity: number = 1) {
  try {
    const data = await medusaRequest("/store/cart/line-items", {
      method: "POST",
      body: JSON.stringify({
        cart_id: cartId,
        variant_id: variantId,
        quantity
      })
    })
    return data.cart
  } catch (error) {
    // Re-throw without logging sensitive details
    throw error
  }
}

export async function updateCartItem(cartId: string, lineItemId: string, quantity: number) {
  try {
    const data = await medusaRequest("/store/cart/line-items", {
      method: "PUT",
      body: JSON.stringify({
        cart_id: cartId,
        line_item_id: lineItemId,
        quantity
      })
    })
    return data.cart
  } catch (error) {
    // Re-throw without logging sensitive details
    throw error
  }
}

export async function removeCartItem(cartId: string, lineItemId: string) {
  try {
    const data = await medusaRequest("/store/cart/line-items", {
      method: "DELETE",
      body: JSON.stringify({
        cart_id: cartId,
        line_item_id: lineItemId
      })
    })
    return data.cart
  } catch (error) {
    // Re-throw without logging sensitive details
    throw error
  }
}

export async function updateShippingAddress(cartId: string, address: any) {
  try {
    const data = await medusaRequest("/store/cart/shipping-address", {
      method: "PUT",
      body: JSON.stringify({
        cart_id: cartId,
        address
      })
    })
    return data.cart
  } catch (error) {
    // Re-throw without logging sensitive details
    throw error
  }
}

// Payment Management
export async function createPaymentSessions(cartId: string) {
  try {
    const data = await medusaRequest("/store/payment/sessions", {
      method: "POST",
      body: JSON.stringify({
        cart_id: cartId
      })
    })
    return data.cart
  } catch (error) {
    // Re-throw without logging sensitive details
    throw error
  }
}

export async function selectPaymentSession(cartId: string, providerId: string) {
  try {
    const data = await medusaRequest("/store/payment/sessions", {
      method: "PATCH",
      body: JSON.stringify({
        cart_id: cartId,
        provider_id: providerId
      })
    })
    return data.cart
  } catch (error) {
    // Re-throw without logging sensitive details
    throw error
  }
}

export async function completePayment(cartId: string) {
  try {
    const data = await medusaRequest("/store/payment/complete", {
      method: "POST",
      body: JSON.stringify({
        cart_id: cartId
      })
    })
    return data.cart
  } catch (error) {
    // Re-throw without logging sensitive details
    throw error
  }
}

// Checkout
export async function validateCheckout(cartId: string) {
  try {
    const data = await medusaRequest("/store/checkout", {
      method: "POST",
      body: JSON.stringify({
        cart_id: cartId
      })
    })
    return data
  } catch (error) {
    // Re-throw without logging sensitive details
    throw error
  }
}

export async function completeCheckout(cartId: string) {
  try {
    const data = await medusaRequest("/store/checkout/complete", {
      method: "POST",
      body: JSON.stringify({
        cart_id: cartId
      })
    })
    return data.order
  } catch (error) {
    // Re-throw without logging sensitive details
    throw error
  }
}

// Orders
export async function getOrder(orderId: string) {
  try {
    const data = await medusaRequest(`/store/orders?order_id=${orderId}`)
    return data.order
  } catch (error) {
    // Error logging removed to avoid exposing API details
    return null
  }
}

export async function getOrderConfirmation(orderId: string) {
  try {
    const data = await medusaRequest(`/store/orders/confirmation?order_id=${orderId}`)
    return data.confirmation
  } catch (error) {
    // Error logging removed to avoid exposing API details
    return null
  }
}
