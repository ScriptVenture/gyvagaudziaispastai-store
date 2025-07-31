'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Search, Menu, X, User, Heart, Shield, Truck, Phone } from 'lucide-react'
import { Button, TextField, DropdownMenu, Flex, Text, Badge, Separator } from '@radix-ui/themes'
import { brandColors, componentStyles } from '@/utils/colors'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      {/* Premium announcement bar */}
      <div className="text-white text-sm py-2 text-center" style={{ 
        background: componentStyles.gradients.primary 
      }}>
        <Flex justify="center" align="center" gap="2">
          <Truck className="w-4 h-4" />
          <Text size="2" weight="medium">FREE SHIPPING ON ORDERS $75+ | 30-DAY RETURN GUARANTEE</Text>
          <Shield className="w-4 h-4" />
        </Flex>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4 py-4">
        <Flex align="center" justify="between" gap="4">
          {/* Modern logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                style={{ 
                  background: componentStyles.gradients.primary,
                  boxShadow: componentStyles.buttons.primary.shadow 
                }}
              >
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                <Shield className="w-2.5 h-2.5 text-amber-800" />
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold tracking-tight" style={{ color: brandColors.primary }}>
                WildControl
              </h1>
              <Text size="1" color="gray" className="font-medium">
                Professional Solutions
              </Text>
            </div>
          </Link>

          {/* Professional navigation */}
          <nav className="hidden lg:flex items-center">
            <Flex align="center" gap="2">
              {[
                { label: 'Products', href: '/products' },
                { label: 'Solutions', href: '/solutions' },
                { label: 'Learning Center', href: '/learning' },
                { label: 'Support', href: '/support' }
              ].map((item) => (
                <Link 
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-gray-50 relative group"
                  style={{ color: brandColors.textSecondary }}
                >
                  {item.label}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 transition-all duration-200 group-hover:w-3/4" style={{ backgroundColor: brandColors.primary }} />
                </Link>
              ))}
            </Flex>
          </nav>

          {/* Modern search and actions */}
          <Flex align="center" gap="3">
            {/* Search */}
            <div className="hidden md:block relative">
              <TextField.Root 
                placeholder="Search wildlife solutions..." 
                size="3" 
                className="w-80"
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
            <Flex align="center" gap="2">
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
                    Sign In
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    <div className="w-4 h-4 mr-2" />
                    Create Account
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item>
                    <div className="w-4 h-4 mr-2" />
                    My Orders
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>

              {/* Shopping Cart */}
              <div className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                <ShoppingCart className="w-5 h-5 group-hover:text-gray-700" style={{ color: brandColors.textTertiary }} />
                <div 
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ 
                    backgroundColor: brandColors.secondary,
                    color: brandColors.white,
                    fontSize: '10px'
                  }}
                >
                  0
                </div>
              </div>

              {/* Professional CTA */}
              <Button 
                size="3"
                className="hidden md:flex items-center gap-2 font-medium px-4 py-2 ml-2"
                style={{ 
                  background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryHover} 100%)`,
                  color: brandColors.white,
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(15, 76, 58, 0.15)',
                  border: 'none'
                }}
              >
                <Phone className="w-4 h-4" />
                <span>Get Expert Help</span>
              </Button>
            </Flex>
          </Flex>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="3"
            className="lg:hidden"
            onClick={toggleMenu}
            style={{ color: brandColors.textSecondary }}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </Flex>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-6 pb-4 border-t pt-6" style={{ borderColor: brandColors.gray200 }}>
            <Flex direction="column" gap="1">
              <Button variant="ghost" size="3" className="justify-start font-medium w-full">
                <Link href="/products">Products</Link>
              </Button>
              <Button variant="ghost" size="3" className="justify-start font-medium w-full">
                <Link href="/solutions">Solutions</Link>
              </Button>
              <Button variant="ghost" size="3" className="justify-start font-medium w-full">
                <Link href="/learning">Learning</Link>
              </Button>
              <Button variant="ghost" size="3" className="justify-start font-medium w-full">
                <Link href="/support">Support</Link>
              </Button>
              <Separator className="my-3" />
              <div className="md:hidden">
                <TextField.Root 
                  placeholder="Search..." 
                  size="3"
                  className="w-full mb-3"
                  style={{ borderRadius: '12px' }}
                >
                  <TextField.Slot>
                    <Search className="w-4 h-4" />
                  </TextField.Slot>
                </TextField.Root>
              </div>
              <Button 
                size="3"
                className="font-medium w-full"
                style={{ 
                  background: componentStyles.gradients.primary,
                  color: brandColors.white,
                  borderRadius: '12px'
                }}
              >
                <Phone className="w-4 h-4" />
                Get Quote
              </Button>
            </Flex>
          </div>
        )}
      </div>
    </header>
  )
}