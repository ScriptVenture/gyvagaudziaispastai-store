"use client"

import { useState, useEffect } from 'react'

export interface CookieConsentData {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
  version: string
}

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookieConsentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load consent from localStorage
    const loadConsent = () => {
      try {
        const stored = localStorage.getItem('cookie-consent')
        if (stored) {
          const parsed = JSON.parse(stored)
          setConsent(parsed)
        }
      } catch (error) {
        console.error('Error loading cookie consent:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadConsent()
  }, [])

  const updateConsent = (newConsent: Partial<CookieConsentData>) => {
    const updatedConsent = {
      necessary: true, // Always true
      functional: newConsent.functional ?? false,
      analytics: newConsent.analytics ?? false,
      marketing: newConsent.marketing ?? false,
      timestamp: new Date().toISOString(),
      version: '1.0',
      ...newConsent
    }

    localStorage.setItem('cookie-consent', JSON.stringify(updatedConsent))
    setConsent(updatedConsent)
    
    // Trigger consent change event
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: updatedConsent 
    }))
  }

  const clearConsent = () => {
    localStorage.removeItem('cookie-consent')
    setConsent(null)
  }

  const hasConsent = (type: keyof CookieConsentData): boolean => {
    if (!consent) return false
    return consent[type] === true
  }

  const isConsentGiven = (): boolean => {
    return consent !== null
  }

  return {
    consent,
    isLoading,
    updateConsent,
    clearConsent,
    hasConsent,
    isConsentGiven
  }
}

// Utility functions for cookie management
export const cookieUtils = {
  // Check if a specific cookie type is allowed
  canUse: (type: keyof CookieConsentData): boolean => {
    try {
      const stored = localStorage.getItem('cookie-consent')
      if (!stored) return false
      
      const consent = JSON.parse(stored)
      return consent[type] === true
    } catch {
      return false
    }
  },

  // Initialize Google Analytics if consent is given
  initializeAnalytics: () => {
    if (cookieUtils.canUse('analytics')) {
      // Initialize Google Analytics
      if (typeof window !== 'undefined' && !window.gtag) {
        const script = document.createElement('script')
        script.async = true
        script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID'
        document.head.appendChild(script)

        window.dataLayer = window.dataLayer || []
        window.gtag = function() {
          window.dataLayer.push(arguments)
        }
        window.gtag('js', new Date())
        window.gtag('config', 'GA_MEASUREMENT_ID', {
          anonymize_ip: true,
          cookie_flags: 'SameSite=None;Secure'
        })
      }
    }
  },

  // Initialize marketing pixels if consent is given
  initializeMarketing: () => {
    if (cookieUtils.canUse('marketing')) {
      // Initialize Facebook Pixel, Google Ads, etc.
      console.log('Marketing cookies initialized')
    }
  },

  // Set functional cookies if consent is given
  setFunctionalCookie: (name: string, value: string, days: number = 365) => {
    if (cookieUtils.canUse('functional')) {
      const expires = new Date()
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax;Secure`
    }
  },

  // Get functional cookie if consent is given
  getFunctionalCookie: (name: string): string | null => {
    if (!cookieUtils.canUse('functional')) return null
    
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  },

  // Remove all non-necessary cookies
  clearNonEssentialCookies: () => {
    const cookies = document.cookie.split(";")
    
    // List of essential cookies that should not be deleted
    const essentialCookies = [
      'session_id',
      'cart_token',
      'csrf_token',
      'cookie-consent'
    ]

    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf("=")
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      
      if (!essentialCookies.includes(name)) {
        // Delete the cookie
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`
      }
    })
  }
}

// Global type declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
