"use client"

import { useState, useEffect } from 'react'
import { Cookie, Settings, X, Check, Shield, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@radix-ui/themes'
import Link from 'next/link'

interface CookiePreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    functional: true,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
    
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
    setIsVisible(false)
    
    // Initialize analytics and other services
    initializeServices(allAccepted)
  }

  const handleAcceptSelected = () => {
    const selectedPreferences = {
      ...preferences,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
    
    localStorage.setItem('cookie-consent', JSON.stringify(selectedPreferences))
    setIsVisible(false)
    
    // Initialize only selected services
    initializeServices(selectedPreferences)
  }

  const handleRejectAll = () => {
    const minimal = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
    
    localStorage.setItem('cookie-consent', JSON.stringify(minimal))
    setIsVisible(false)
    
    // Initialize only necessary services
    initializeServices(minimal)
  }

  const initializeServices = (consent: any) => {
    // Initialize Google Analytics if analytics is enabled
    if (consent.analytics && typeof window !== 'undefined') {
      // Add Google Analytics initialization here
      console.log('Analytics enabled')
    }
    
    // Initialize other services based on consent
    if (consent.functional) {
      console.log('Functional cookies enabled')
    }
    
    if (consent.marketing) {
      console.log('Marketing cookies enabled')
    }
  }

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return // Cannot disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
      
      {/* Cookie Consent Modal */}
      <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 lg:left-8 lg:right-8 xl:left-auto xl:right-8 xl:bottom-8 xl:max-w-md z-50">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Cookie className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Slapukų nustatymai</h3>
                  <p className="text-sm opacity-90">Valdykite savo privatumo pasirinkimus</p>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {!showDetails ? (
              // Simple View
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Mes naudojame slapukus, kad pagerintume jūsų naršymo patirtį, 
                      analizuotume svetainės naudojimą ir padėtume mūsų rinkodaros pastangose. 
                      Galite pasirinkti, kuriuos slapukus priimti.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Jūsų privatumas</span>
                  </div>
                  <p className="text-xs text-blue-800">
                    Mes gerbiame jūsų privatumą. Sužinokite daugiau mūsų{' '}
                    <Link href="/privacy" className="underline hover:no-underline">
                      privatumo politikoje
                    </Link>{' '}
                    ir{' '}
                    <Link href="/cookies" className="underline hover:no-underline">
                      slapukų politikoje
                    </Link>.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleAcceptAll}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Priimti visus slapukus
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowDetails(true)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Nustatymai
                    </Button>
                    
                    <Button
                      onClick={handleRejectAll}
                      variant="outline"
                      className="flex-1"
                    >
                      Tik būtini
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Detailed Settings View
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Slapukų kategorijos</h4>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    ← Atgal
                  </button>
                </div>

                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {/* Necessary Cookies */}
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-green-900">Būtini slapukai</span>
                      </div>
                      <div className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-medium">
                        BŪTINA
                      </div>
                    </div>
                    <p className="text-sm text-green-800 mb-2">
                      Šie slapukai yra būtini svetainės veikimui ir negali būti išjungti.
                    </p>
                    <p className="text-xs text-green-700">
                      Krepšelio funkcionalumas, sesijos palaikymas, saugumas
                    </p>
                  </div>

                  {/* Functional Cookies */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">Funkciniai slapukai</span>
                      </div>
                      <Switch
                        checked={preferences.functional}
                        onCheckedChange={(checked) => updatePreference('functional', checked)}
                        size="2"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Pagerina jūsų naudojimosi patirtį išsaugodami nustatymus.
                    </p>
                    <p className="text-xs text-gray-500">
                      Kalbos pasirinkimas, peržiūrėtos prekės, valiutos nustatymai
                    </p>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="font-medium">Analitikos slapukai</span>
                      </div>
                      <Switch
                        checked={preferences.analytics}
                        onCheckedChange={(checked) => updatePreference('analytics', checked)}
                        size="2"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Padeda mums suprasti, kaip naudojate svetainę ir ją pagerinti.
                    </p>
                    <p className="text-xs text-gray-500">
                      Google Analytics, puslapių peržiūros, naudotojo kelias
                    </p>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="font-medium">Rinkodaros slapukai</span>
                      </div>
                      <Switch
                        checked={preferences.marketing}
                        onCheckedChange={(checked) => updatePreference('marketing', checked)}
                        size="2"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Naudojami personalizuotoms reklamos ir rinkodaros kampanijoms.
                    </p>
                    <p className="text-xs text-gray-500">
                      Facebook Pixel, Google Ads, retargeting
                    </p>
                  </div>
                </div>

                {/* Detailed Action Buttons */}
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button
                    onClick={handleAcceptSelected}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Išsaugoti nustatymus
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAcceptAll}
                      variant="outline"
                      className="flex-1"
                    >
                      Priimti visus
                    </Button>
                    
                    <Button
                      onClick={handleRejectAll}
                      variant="outline"
                      className="flex-1"
                    >
                      Tik būtini
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Powered by UAB DIGIMAKSAS</span>
              <div className="flex gap-3">
                <Link href="/privacy" className="hover:text-gray-900">Privatumas</Link>
                <Link href="/cookies" className="hover:text-gray-900">Slapukai</Link>
                <Link href="/gdpr" className="hover:text-gray-900">BDAR</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
