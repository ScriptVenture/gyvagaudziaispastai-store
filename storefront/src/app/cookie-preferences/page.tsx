"use client"

import { useState, useEffect } from 'react'
import { Container, Heading, Text, Box, Separator, Button, Switch } from "@radix-ui/themes"
import { Cookie, Shield, Settings, Check, X, Info, AlertCircle } from 'lucide-react'
import { useCookieConsent, cookieUtils, type CookieConsentData } from '@/hooks/useCookieConsent'
import Link from 'next/link'

export default function CookiePreferencesPage() {
  const { consent, updateConsent, clearConsent, isLoading } = useCookieConsent()
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (consent) {
      setPreferences({
        necessary: consent.necessary,
        functional: consent.functional,
        analytics: consent.analytics,
        marketing: consent.marketing
      })
    }
  }, [consent])

  const handlePreferenceChange = (key: keyof CookieConsentData, value: boolean) => {
    if (key === 'necessary') return // Cannot change necessary cookies
    
    setPreferences(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    updateConsent(preferences)
    setHasChanges(false)
    setShowSuccess(true)
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
    
    // Clear non-essential cookies if they were disabled
    if (!preferences.functional || !preferences.analytics || !preferences.marketing) {
      cookieUtils.clearNonEssentialCookies()
    }
  }

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    }
    setPreferences(allAccepted)
    updateConsent(allAccepted)
    setHasChanges(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleRejectAll = () => {
    const minimal = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    }
    setPreferences(minimal)
    updateConsent(minimal)
    setHasChanges(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    
    // Clear all non-essential cookies
    cookieUtils.clearNonEssentialCookies()
  }

  const handleReset = () => {
    clearConsent()
    setPreferences({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    })
    setHasChanges(false)
    cookieUtils.clearNonEssentialCookies()
  }

  if (isLoading) {
    return (
      <Container size="3" className="py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <Text>Kraunami slapukų nustatymai...</Text>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container size="3" className="py-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Nustatymai išsaugoti sėkmingai!</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl flex items-center justify-center">
            <Cookie className="w-6 h-6 text-white" />
          </div>
          <Heading size="8" className="text-green-700">Slapukų nustatymai</Heading>
        </div>
        <Text size="4" color="gray" className="max-w-2xl mx-auto">
          Valdykite savo slapukų preferences ir privatumo nustatymus. 
          Galite bet kada pakeisti šiuos nustatymus.
        </Text>
      </div>

      <Separator size="4" className="my-6" />

      {/* Current Status */}
      {consent && (
        <Box className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-600" />
            <Text size="3" weight="bold" className="text-blue-900">Dabartiniai nustatymai</Text>
          </div>
          <Text size="2" className="text-blue-800 mb-3">
            Paskutinį kartą atnaujinta: {new Date(consent.timestamp).toLocaleString('lt-LT')}
          </Text>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(preferences).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <Text size="1" className="capitalize">
                  {key === 'necessary' ? 'Būtini' : 
                   key === 'functional' ? 'Funkciniai' :
                   key === 'analytics' ? 'Analitikos' : 'Rinkodaros'}
                </Text>
              </div>
            ))}
          </div>
        </Box>
      )}

      {/* Cookie Categories */}
      <div className="space-y-6">
        {/* Necessary Cookies */}
        <Box className="p-6 border border-green-200 rounded-xl bg-green-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <Heading size="5" className="text-green-900">Būtini slapukai</Heading>
                <Text size="2" className="text-green-700">Reikalingi svetainės veikimui</Text>
              </div>
            </div>
            <div className="px-3 py-1 bg-green-200 text-green-800 text-sm rounded-full font-medium">
              VISADA ĮJUNGTA
            </div>
          </div>
          
          <Text size="3" className="text-green-800 mb-4">
            Šie slapukai yra būtini svetainės veikimui ir negali būti išjungti. 
            Jie paprastai nustatomi tik atsižvelgiant į jūsų veiksmus.
          </Text>
          
          <div className="bg-white/60 rounded-lg p-4">
            <Text size="2" weight="bold" className="text-green-900 mb-2">Naudojami slapukai:</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
              <div>• session_id - Sesijos identifikatorius</div>
              <div>• cart_token - Krepšelio duomenys</div>
              <div>• csrf_token - Saugumo apsauga</div>
              <div>• language - Kalbos pasirinkimas</div>
            </div>
          </div>
        </Box>

        {/* Functional Cookies */}
        <Box className="p-6 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <Heading size="5">Funkciniai slapukai</Heading>
                <Text size="2" color="gray">Pagerina jūsų naudojimosi patirtį</Text>
              </div>
            </div>
            <Switch
              checked={preferences.functional}
              onCheckedChange={(checked) => handlePreferenceChange('functional', checked)}
              size="3"
            />
          </div>
          
          <Text size="3" color="gray" className="mb-4">
            Šie slapukai leidžia svetainei atsiminti jūsų pasirinkimus ir suteikti 
            pagerintas, labiau personalizuotas funkcijas.
          </Text>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <Text size="2" weight="bold" className="mb-2">Funkcionalumas:</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              <div>• Jūsų nustatymai ir preferences</div>
              <div>• Peržiūrėtos prekės</div>
              <div>• Valiutos pasirinkimas</div>
              <div>• Geografinės srities nustatymai</div>
            </div>
          </div>
        </Box>

        {/* Analytics Cookies */}
        <Box className="p-6 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Cookie className="w-5 h-5 text-white" />
              </div>
              <div>
                <Heading size="5">Analitikos slapukai</Heading>
                <Text size="2" color="gray">Padeda mums pagerinti svetainę</Text>
              </div>
            </div>
            <Switch
              checked={preferences.analytics}
              onCheckedChange={(checked) => handlePreferenceChange('analytics', checked)}
              size="3"
            />
          </div>
          
          <Text size="3" color="gray" className="mb-4">
            Šie slapukai padeda mums suprasti, kaip lankytojai naudojasi svetaine, 
            kad galėtume ją pagerinti ir optimizuoti.
          </Text>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <Text size="2" weight="bold" className="mb-2">Duomenų rinkimas:</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              <div>• Google Analytics statistika</div>
              <div>• Puslapių peržiūros</div>
              <div>• Naudotojo kelias svetainėje</div>
              <div>• Veiklos analizė (anoniminė)</div>
            </div>
          </div>
        </Box>

        {/* Marketing Cookies */}
        <Box className="p-6 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <Heading size="5">Rinkodaros slapukai</Heading>
                <Text size="2" color="gray">Personalizuotos reklamos</Text>
              </div>
            </div>
            <Switch
              checked={preferences.marketing}
              onCheckedChange={(checked) => handlePreferenceChange('marketing', checked)}
              size="3"
            />
          </div>
          
          <Text size="3" color="gray" className="mb-4">
            Šie slapukai naudojami reklamos tikslais ir padeda rodyti jums 
            aktualias reklamas kitose svetainėse.
          </Text>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <Text size="2" weight="bold" className="mb-2">Rinkodaros funkcijos:</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              <div>• Facebook Pixel</div>
              <div>• Google Ads retargeting</div>
              <div>• Personalizuotos reklamos</div>
              <div>• Konversijų sekimas</div>
            </div>
          </div>
        </Box>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-4">
        {hasChanges && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="w-4 h-4" />
              <Text size="2" weight="bold">Turite neišsaugotų pakeitimų</Text>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            size="3"
          >
            <Check className="w-4 h-4 mr-2" />
            Išsaugoti nustatymus
          </Button>
          
          <Button
            onClick={handleAcceptAll}
            variant="outline"
            className="flex-1"
            size="3"
          >
            Priimti visus slapukus
          </Button>
          
          <Button
            onClick={handleRejectAll}
            variant="outline"
            className="flex-1"
            size="3"
          >
            Tik būtini slapukai
          </Button>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleReset}
            variant="ghost"
            size="2"
            className="text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-2" />
            Atstatyti visus nustatymus
          </Button>
        </div>
      </div>

      {/* Information Links */}
      <Separator size="4" className="my-8" />
      
      <div className="text-center space-y-4">
        <Text size="3" weight="bold">Daugiau informacijos</Text>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/privacy" className="text-blue-600 hover:text-blue-700 text-sm">
            Privatumo politika
          </Link>
          <Link href="/cookies" className="text-blue-600 hover:text-blue-700 text-sm">
            Slapukų politika
          </Link>
          <Link href="/gdpr" className="text-blue-600 hover:text-blue-700 text-sm">
            BDAR teisės
          </Link>
          <Link href="/terms" className="text-blue-600 hover:text-blue-700 text-sm">
            Naudojimo sąlygos
          </Link>
        </div>
      </div>
    </Container>
  )
}
