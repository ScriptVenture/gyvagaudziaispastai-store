import { test, expect } from '@playwright/test'

test.describe('E-commerce Shopping Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete full shopping flow', async ({ page }) => {
    // 1. Navigate to homepage and verify it loads
    await expect(page).toHaveTitle(/Gyvagaudziaispastai/)
    await expect(page.locator('header')).toBeVisible()
    
    // 2. Browse products
    await page.click('text=Spąstų katalogas')
    await page.waitForURL('/traps')
    
    // Verify product listing page
    await expect(page.locator('[data-testid="products-grid"]')).toBeVisible()
    
    // 3. View product details
    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()
    
    // Verify product page
    await expect(page.locator('[data-testid="product-title"]')).toBeVisible()
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible()
    await expect(page.locator('[data-testid="add-to-cart"]')).toBeVisible()
    
    // 4. Add product to cart
    await page.click('[data-testid="add-to-cart"]')
    
    // Verify cart update
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1')
    
    // 5. Go to cart
    await page.click('[data-testid="cart-link"]')
    await page.waitForURL('/cart')
    
    // Verify cart page
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible()
    await expect(page.locator('[data-testid="cart-total"]')).toBeVisible()
    
    // 6. Proceed to checkout
    await page.click('[data-testid="checkout-button"]')
    await page.waitForURL('/checkout')
    
    // Verify checkout page
    await expect(page.locator('[data-testid="checkout-form"]')).toBeVisible()
    
    // 7. Fill customer information
    await page.fill('[data-testid="customer-email"]', 'test@example.com')
    await page.fill('[data-testid="first-name"]', 'Jonas')
    await page.fill('[data-testid="last-name"]', 'Jonaitis')
    await page.fill('[data-testid="address"]', 'Gedimino pr. 1')
    await page.fill('[data-testid="city"]', 'Vilnius')
    await page.fill('[data-testid="postal-code"]', '01103')
    
    // 8. Select shipping method
    await page.click('[data-testid="shipping-method"]')
    await page.waitForSelector('[data-testid="shipping-options"]')
    await page.click('[data-testid="shipping-option"]:first-child')
    
    // 9. Select payment method
    await page.click('[data-testid="payment-method-paysera"]')
    
    // 10. Review order
    await expect(page.locator('[data-testid="order-summary"]')).toBeVisible()
    
    // 11. Place order (but don't actually complete payment)
    await page.click('[data-testid="place-order"]')
    
    // Verify redirect to payment
    await page.waitForURL('**/create-payment**')
    await expect(page).toHaveURL(/payment|paysera/)
  })

  test('should handle empty cart', async ({ page }) => {
    await page.goto('/cart')
    
    await expect(page.locator('[data-testid="empty-cart"]')).toBeVisible()
    await expect(page.locator('text=Jūsų krepšelis tuščias')).toBeVisible()
    
    // Continue shopping button should work
    await page.click('[data-testid="continue-shopping"]')
    await expect(page).toHaveURL('/')
  })

  test('should update cart quantities', async ({ page }) => {
    // First add a product to cart (simplified)
    await page.goto('/traps')
    await page.click('[data-testid="product-card"]')
    await page.click('[data-testid="add-to-cart"]')
    
    // Go to cart
    await page.goto('/cart')
    
    // Update quantity
    const quantityInput = page.locator('[data-testid="quantity-input"]')
    await quantityInput.clear()
    await quantityInput.fill('2')
    
    // Verify total updated
    await expect(page.locator('[data-testid="cart-total"]')).not.toHaveText('€0.00')
  })

  test('should remove items from cart', async ({ page }) => {
    // Add product to cart first
    await page.goto('/traps')
    await page.click('[data-testid="product-card"]')
    await page.click('[data-testid="add-to-cart"]')
    
    // Go to cart
    await page.goto('/cart')
    
    // Remove item
    await page.click('[data-testid="remove-item"]')
    
    // Verify cart is empty
    await expect(page.locator('[data-testid="empty-cart"]')).toBeVisible()
  })
})