"use client"

import { useState, useEffect } from 'react'
import { Shield, Cookie, Settings, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PrivacyBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already acknowledged privacy policy
    const acknowledged = localStorage.getItem('privacy-acknowledged')
    if (!acknowledged) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcknowledge = () => {
    localStorage.setItem('privacy-acknowledged', 'true')
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    // Set a temporary dismissal (will show again on next visit)
    sessionStorage.setItem('privacy-dismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">
                Jūsų privatumas yra svarbus mums
              </p>
              <p className="text-xs opacity-90 leading-relaxed">
                Mes laikomės BDAR reikalavimų ir gerbiame jūsų duomenų apsaugos teises. 
                Sužinokite, kaip tvarkome jūsų asmens duomenis mūsų{' '}
                <Link href="/privacy" className="underline hover:no-underline font-medium">
                  privatumo politikoje
                </Link>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/privacy">
              <Button
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs"
                variant="outline"
              >
                Skaityti daugiau
              </Button>
            </Link>
            
            <Button
              size="sm"
              onClick={handleAcknowledge}
              className="bg-white text-blue-700 hover:bg-gray-100 text-xs font-medium"
            >
              Supratau
            </Button>
            
            <button
              onClick={handleDismiss}
              className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
