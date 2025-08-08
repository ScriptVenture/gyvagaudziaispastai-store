import { test, expect } from '@playwright/test'

test.describe('Website Navigation', () => {
  test('should navigate to all main pages', async ({ page }) => {
    await page.goto('/')
    
    // Test home page
    await expect(page).toHaveTitle(/Gyvagaudziaispastai/)
    
    // Test main navigation
    const mainNavItems = [
      { text: 'Spąstų katalogas', url: '/traps' },
      { text: 'Vadovas', url: '/guide' },
      { text: 'Pagalba', url: '/support' },
      { text: 'Sekti siuntą', url: '/track' }
    ]
    
    for (const item of mainNavItems) {
      await page.click(`text=${item.text}`)
      await page.waitForURL(item.url)
      await expect(page).toHaveURL(item.url)
      
      // Verify page loads content
      await expect(page.locator('main')).toBeVisible()
      
      // Go back to home
      await page.goto('/')
    }
  })

  test('should navigate to footer compliance pages', async ({ page }) => {
    await page.goto('/')
    
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded()
    
    const compliancePages = [
      { text: 'Privatumo politika', url: '/privacy' },
      { text: 'Sąlygos', url: '/terms' },
      { text: 'Grąžinimai', url: '/returns' },
      { text: 'BDAR', url: '/gdpr' },
      { text: 'Slapukai', url: '/cookies' },
      { text: 'Apie mus', url: '/about' }
    ]
    
    for (const page_info of compliancePages) {
      await page.click(`footer a:has-text("${page_info.text}")`)
      await page.waitForURL(page_info.url)
      await expect(page).toHaveURL(page_info.url)
      
      // Verify page has content
      await expect(page.locator('h1, h2')).toBeVisible()
      
      // Go back to home
      await page.goto('/')
      await page.locator('footer').scrollIntoViewIfNeeded()
    }
  })

  test('should handle mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check if mobile menu button exists and works
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-toggle"]')
    
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click()
      
      // Verify mobile menu opens
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
      
      // Test navigation item in mobile menu
      await page.click('[data-testid="mobile-menu"] a:has-text("Spąstų katalogas")')
      await expect(page).toHaveURL('/traps')
    }
  })

  test('should handle search functionality', async ({ page }) => {
    await page.goto('/')
    
    const searchInput = page.locator('[data-testid="search-input"]')
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('spąstai')
      await page.keyboard.press('Enter')
      
      await page.waitForURL('/search*')
      await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
    }
  })

  test('should load all critical page elements', async ({ page }) => {
    await page.goto('/')
    
    // Header elements
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('[data-testid="logo"]')).toBeVisible()
    
    // Main content
    await expect(page.locator('main')).toBeVisible()
    
    // Footer elements
    await expect(page.locator('footer')).toBeVisible()
    
    // Check for no console errors
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    // Reload page to catch any console errors
    await page.reload()
    
    // Allow some time for any async errors
    await page.waitForTimeout(2000)
    
    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') &&
      !error.includes('chrome-extension') &&
      !error.includes('ERR_BLOCKED_BY_CLIENT')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })

  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/non-existent-page', { waitUntil: 'networkidle' })
    
    // Should show 404 page or redirect to home
    const is404 = page.url().includes('/non-existent-page')
    const isHome = page.url().endsWith('/')
    
    expect(is404 || isHome).toBe(true)
    
    // Page should still be functional
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })
})