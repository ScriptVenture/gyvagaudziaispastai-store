'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Search, Menu, X, User, Heart, Shield, Truck, Phone, Box } from 'lucide-react'
import { Button, TextField, DropdownMenu, Flex, Text, Separator } from '@radix-ui/themes'
import { brandColors, componentStyles } from '@/utils/colors'
import TrapLogo from '@/components/ui/TrapLogo'
import { useCart } from '@/contexts/cart-context'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cart, isLoading } = useCart()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  
  // Calculate total items in cart
  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      {/* Premium announcement bar */}
      <div className="text-white text-sm py-2 text-center" style={{ 
        background: componentStyles.gradients.primary 
      }}>
        <Flex justify="center" align="center" gap="2">
          <Truck className="w-4 h-4" />
          <Text size="2" weight="medium">NEMOKAMAS PRISTATYMAS SPĄSTAMS NUO €75+ | 30 DIENŲ GRĄŽINIMO GARANTIJA</Text>
          <Shield className="w-4 h-4" />
        </Flex>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3">
        <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4">
          {/* Modern logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <div 
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-md sm:rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-sm sm:shadow-md lg:shadow-lg group-hover:shadow-xl transition-all duration-300"
                style={{ 
                  background: componentStyles.gradients.primary,
                  boxShadow: componentStyles.buttons.primary.shadow 
                }}
              >
                <TrapLogo className="w-6 h-6" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                <Shield className="w-2.5 h-2.5 text-amber-800" />
              </div>
            </div>
            <div className="ml-2 sm:ml-3 md:ml-4">
              <h1 className="text-sm sm:text-lg md:text-xl font-bold tracking-tight truncate" style={{ color: brandColors.primary }}>
                Gyvagaudziaispastai
              </h1>
              <p className="text-xs text-gray-600 font-medium hidden sm:block">
                Humaniški gyvūnų spąstai
              </p>
            </div>
          </Link>

          {/* Professional navigation */}
          <nav className="hidden xl:flex items-center">
            <div className="flex items-center gap-1">
              {[
                { label: 'Gyvūnų spąstai', href: '/traps' },
                { label: 'Pagal gyvūno dydį', href: '/size' },
                { label: 'Kaip naudoti', href: '/guide' },
                { label: 'Pagalba', href: '/support' }
              ].map((item) => (
                <Link 
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-gray-50 relative group"
                  style={{ color: brandColors.textSecondary }}
                >
                  {item.label}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 transition-all duration-200 group-hover:w-3/4" style={{ backgroundColor: brandColors.primary }} />
                </Link>
              ))}
            </div>
          </nav>

          {/* Modern search and actions */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            {/* Search */}
            <div className="hidden lg:block relative">
              <TextField.Root 
                placeholder="Ieškoti gyvūnų spąstų..." 
                size="3" 
                className="w-48 lg:w-64 xl:w-80"
                style={{ 
                  borderRadius: '12px',
                  border: `1px solid ${brandColors.gray200}`,
                  backgroundColor: brandColors.backgroundSecondary 
                }}
              >
                <TextField.Slot>
                  <Search className="w-4 h-4" style={{ color: brandColors.textTertiary }} />
                </TextField.Slot>
              </TextField.Root>
            </div>

            {/* Professional action buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* User Account */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <div className="p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                    <User className="w-5 h-5 group-hover:text-gray-700" style={{ color: brandColors.textTertiary }} />
                  </div>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end" className="w-48">
                  <DropdownMenu.Item className="font-medium">
                    <User className="w-4 h-4 mr-2" />
                    Prisijungti
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    <div className="w-4 h-4 mr-2" />
                    Sukurti paskyrą
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item>
                    <div className="w-4 h-4 mr-2" />
                    Mano užsakymai
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    <Heart className="w-4 h-4 mr-2" />
                    Pageidavimų sąrašas
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>

              {/* Shopping Cart */}
              <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                <ShoppingCart className="w-5 h-5 group-hover:text-gray-700" style={{ color: brandColors.textTertiary }} />
                {cartItemCount > 0 && (
                  <div 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold animate-pulse"
                    style={{ 
                      backgroundColor: brandColors.secondary,
                      color: brandColors.white,
                      fontSize: '10px'
                    }}
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </div>
                )}
                {isLoading && cartItemCount === 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
                )}
              </Link>

              {/* Professional CTA */}
              <Button 
                size="3"
                className="hidden xl:flex items-center gap-2 font-medium px-4 py-2 ml-2"
                style={{ 
                  background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryHover} 100%)`,
                  color: brandColors.white,
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(15, 76, 58, 0.15)',
                  border: 'none'
                }}
              >
                <Phone className="w-4 h-4" />
                <span className="hidden 2xl:inline">Gauti ekspertų pagalbą</span>
                <span className="xl:inline 2xl:hidden">Pagalba</span>
              </Button>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="3"
            className="xl:hidden"
            onClick={toggleMenu}
            style={{ color: brandColors.textSecondary }}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="xl:hidden mt-4 sm:mt-6 pb-3 sm:pb-4 border-t pt-4 sm:pt-6" style={{ borderColor: brandColors.gray200 }}>
            <div className="flex flex-col gap-1">
              <Link href="/traps" className="w-full p-2 sm:p-3 text-left font-medium rounded-lg hover:bg-gray-50 transition-colors" style={{ color: brandColors.textSecondary }}>
                Gyvūnų spąstai
              </Link>
              <Link href="/size" className="w-full p-2 sm:p-3 text-left font-medium rounded-lg hover:bg-gray-50 transition-colors" style={{ color: brandColors.textSecondary }}>
                Pagal gyvūno dydį
              </Link>
              <Link href="/guide" className="w-full p-2 sm:p-3 text-left font-medium rounded-lg hover:bg-gray-50 transition-colors" style={{ color: brandColors.textSecondary }}>
                Kaip naudoti
              </Link>
              <Link href="/support" className="w-full p-2 sm:p-3 text-left font-medium rounded-lg hover:bg-gray-50 transition-colors" style={{ color: brandColors.textSecondary }}>
                Pagalba
              </Link>
              <div className="h-px my-3 bg-gray-200"></div>
              <div className="lg:hidden mb-3">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Ieškoti gyvūnų spąstų..."
                    className="w-full p-3 pl-10 rounded-lg border text-sm"
                    style={{ 
                      borderColor: brandColors.gray200,
                      backgroundColor: brandColors.backgroundSecondary 
                    }}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: brandColors.textTertiary }} />
                </div>
              </div>
              <button 
                className="w-full p-3 font-medium rounded-lg text-white flex items-center justify-center gap-2 transition-all"
                style={{ 
                  background: componentStyles.gradients.primary,
                  borderRadius: '12px'
                }}
              >
                <Phone className="w-4 h-4" />
                Gauti ekspertų pagalbą
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}