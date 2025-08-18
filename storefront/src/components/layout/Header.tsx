'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShoppingCart, Search, Menu, X, User, Heart, Shield, Truck, Phone, Box } from 'lucide-react'
import { Button, TextField, DropdownMenu, Flex, Text, Separator } from '@radix-ui/themes'
import { brandColors, componentStyles } from '@/utils/colors'
import TrapLogo from '@/components/ui/TrapLogo'
import { useCart } from '@/contexts/cart-context'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { cart, isLoading } = useCart()
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleQuickSearch = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Ieškoti spąstų"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  // Calculate total items in cart
  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      {/* Enhanced Premium announcement bar with animations */}
      <div className="relative overflow-hidden text-white text-sm py-3 text-center" style={{ 
        background: 'linear-gradient(135deg, #0F4C3A 0%, #10B981 50%, #059669 100%)'
      }}>
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-2 -left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-2 -right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10">
          <Flex justify="center" align="center" gap="3" className="animate-fade-in">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <Truck className="w-4 h-4 animate-bounce" />
              <Text size="2" weight="bold">NEMOKAMAS PRISTATYMAS NUO €75+</Text>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/40"></div>
            <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <Shield className="w-4 h-4" />
              <Text size="2" weight="bold">30 DIENŲ GARANTIJA</Text>
            </div>
            <div className="hidden md:block w-px h-4 bg-white/40"></div>
            <div className="hidden md:flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <Phone className="w-4 h-4" />
              <Text size="2" weight="bold">24/7 PAGALBA</Text>
            </div>
          </Flex>
        </div>
      </div>

      {/* Enhanced Main navigation */}
      <div className="container mx-auto px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
        <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4">
          {/* Enhanced Modern logo with animations */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <div 
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105"
                style={{ 
                  background: 'linear-gradient(135deg, #0F4C3A 0%, #10B981 50%, #059669 100%)',
                  boxShadow: '0 10px 25px rgba(15, 76, 58, 0.3)'
                }}
              >
                <TrapLogo className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Shield className="w-3 h-3 text-white" />
              </div>
              {/* Floating particles */}
              <div className="absolute -top-2 -left-2 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -bottom-1 -right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping opacity-75 delay-500"></div>
            </div>
            <div className="ml-3 sm:ml-4 md:ml-5">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight truncate bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                Gyvagaudziaispastai
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">
                🏆 #1 Humaniški gyvūnų spąstai Lietuvoje
              </p>
            </div>
          </Link>

          {/* Enhanced Professional navigation with modern styling */}
          <nav className="hidden xl:flex items-center">
            <div className="flex items-center gap-2 bg-gray-50/80 backdrop-blur-sm rounded-2xl p-1 border border-gray-200/60">
              {[
                { label: 'Gyvūnų spąstai', href: '/traps', icon: '🪤' },
                { label: 'Pagal dydį', href: '/size', icon: '📏' },
                { label: 'Gidai', href: '/guide', icon: '📖' },
                { label: 'Pagalba', href: '/support', icon: '💬' }
              ].map((item, index) => (
                <Link 
                  key={item.label}
                  href={item.href}
                  className="group relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:bg-white hover:shadow-md transform hover:-translate-y-0.5"
                  style={{ color: brandColors.textSecondary }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                    <span className="group-hover:text-green-700 transition-colors duration-200">{item.label}</span>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </div>
          </nav>

          {/* Modern search and actions */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            {/* Enhanced Search with modern styling */}
            <div className="hidden lg:block relative group">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <TextField.Root 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ieškoti spąstų pagal gyvūną..." 
                    size="3" 
                    className="w-56 lg:w-72 xl:w-96 transition-all duration-300 group-hover:shadow-lg"
                    style={{ 
                      borderRadius: '16px',
                      border: '2px solid transparent',
                      background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #10B981, #059669) border-box',
                      backgroundColor: 'white'
                    }}
                  >
                    <TextField.Slot>
                      <Search className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                    </TextField.Slot>
                    {searchQuery && (
                      <TextField.Slot>
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </TextField.Slot>
                    )}
                  </TextField.Root>
                  
                  {/* Search suggestions indicator */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 hidden xl:block">
                    ⌘K
                  </div>
                </div>
              </form>
              
              {/* Quick search suggestions */}
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto z-50">
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-2 font-medium">Populiarūs paieškos terminai:</div>
                  <div className="flex flex-wrap gap-2">
                    {['Meškėnų spąstai', 'Kačių spąstai', 'Voverių spąstai', 'Didelių gyvūnų'].map((term) => (
                      <button 
                        key={term} 
                        onClick={() => handleQuickSearch(term)}
                        className="px-3 py-1 bg-gray-50 hover:bg-green-50 rounded-full text-xs text-gray-700 hover:text-green-700 transition-colors duration-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
                  <DropdownMenu.Item className="font-medium" asChild>
                    <Link href="/login">
                      <User className="w-4 h-4 mr-2" />
                      Prisijungti
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/register">
                      <div className="w-4 h-4 mr-2" />
                      Sukurti paskyrą
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item asChild>
                    <Link href="/account/orders">
                      <div className="w-4 h-4 mr-2" />
                      Mano užsakymai
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/account/wishlist">
                      <Heart className="w-4 h-4 mr-2" />
                      Pageidavimų sąrašas
                    </Link>
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

              {/* Professional CTA - Fixed responsive layout */}
              <Link href="/support">
                <Button 
                  size="3"
                  className="hidden xl:flex items-center gap-2 font-medium ml-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryHover} 100%)`,
                    color: brandColors.white,
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(15, 76, 58, 0.2)',
                    border: 'none',
                    padding: '8px 12px',
                    minWidth: 'auto',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-semibold 2xl:inline xl:hidden">Gauti ekspertų pagalbą</span>
                  <span className="text-sm font-semibold xl:inline 2xl:hidden">Pagalba</span>
                </Button>
              </Link>
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
            <div className="flex flex-col gap-2">
              {/* Main Navigation Links */}
              {[
                { label: 'Gyvūnų spąstai', href: '/traps', icon: '🪤' },
                { label: 'Pagal dydį', href: '/size', icon: '📏' },
                { label: 'Gidai', href: '/guide', icon: '📖' },
                { label: 'Pagalba', href: '/support', icon: '💬' }
              ].map((item) => (
                <Link 
                  key={item.label}
                  href={item.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full p-3 sm:p-4 text-left font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 group" 
                  style={{ color: brandColors.textSecondary }}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                  <span className="group-hover:text-green-700 transition-colors duration-200">{item.label}</span>
                </Link>
              ))}
              
              {/* Separator */}
              <div className="h-px my-4 bg-gray-200"></div>
              
              {/* Mobile Search */}
              <div className="lg:hidden mb-4">
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const searchQuery = formData.get('search') as string
                  if (searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                    setIsMenuOpen(false) // Close mobile menu after search
                  }
                }}>
                  <div className="relative">
                    <input 
                      type="text"
                      name="search"
                      placeholder="Ieškoti spąstų pagal gyvūną..."
                      className="w-full p-3 pl-10 pr-4 rounded-lg border text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      style={{ 
                        borderColor: brandColors.gray200,
                        backgroundColor: 'white'
                      }}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: brandColors.textTertiary }} />
                  </div>
                </form>
              </div>
              
              {/* User Account Links */}
              <div className="space-y-2 mb-4">
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full p-3 text-left font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3" 
                  style={{ color: brandColors.textSecondary }}
                >
                  <User className="w-4 h-4" />
                  Prisijungti
                </Link>
                <Link 
                  href="/cart" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full p-3 text-left font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 relative" 
                  style={{ color: brandColors.textSecondary }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Krepšelis</span>
                  {cartItemCount > 0 && (
                    <div 
                      className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold"
                      style={{ 
                        backgroundColor: brandColors.secondary,
                        color: brandColors.white,
                        fontSize: '10px'
                      }}
                    >
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </div>
                  )}
                </Link>
              </div>
              
              {/* CTA Button */}
              <Link href="/support" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <button 
                  className="w-full p-4 font-medium rounded-lg text-white flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
                  style={{ 
                    background: componentStyles.gradients.primary,
                    borderRadius: '12px'
                  }}
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-base">Gauti ekspertų pagalbą</span>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
