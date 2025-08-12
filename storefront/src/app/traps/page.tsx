"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Box, Heading, Text, Button, Flex, Card, Badge, Separator, ScrollArea, Container, IconButton } from '@radix-ui/themes'
import { ShoppingCart, Grid, List, Menu, X, Filter, ChevronRight, Tag, Star } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useProducts, Product } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { brandColors } from '@/utils/colors'
import { getOptimizedImageUrl } from '@/utils/image'
import { CART_API_URL } from '@/lib/config'

export default function TrapsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const { refreshCart, isLoading: cartLoading } = useCart()
  const { categories, loading: categoriesLoading } = useCategories()
  const { products, loading: productsLoading } = useProducts(selectedCategory === 'all' ? undefined : selectedCategory)

  const handleAddToCart = async (variantId: string) => {
    try {
      const response = await fetch(`${CART_API_URL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantId,
          quantity: 1
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }

      // Refresh cart after successful addition
      await refreshCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const loading = productsLoading || categoriesLoading

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Text>Kraunami gyvūnų spąstai...</Text>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <Heading size="6" style={{ color: brandColors.primary }}>
            Gyvūnų spąstai
          </Heading>
          <Button
            variant="outline"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Modern Sidebar - Inspired by top e-commerce sites */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 fixed lg:sticky top-0 lg:top-0 left-0 z-30 
          w-80 h-screen lg:h-auto bg-white border-r border-gray-200 
          transition-transform duration-300 ease-in-out overflow-y-auto shadow-lg lg:shadow-none
        `}>
          {/* Header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" style={{ color: brandColors.primary }} />
                <Text size="4" weight="bold" style={{ color: brandColors.primary }}>
                  FILTRAI
                </Text>
              </div>
              <Button
                variant="ghost"
                size="1"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            {selectedCategory !== 'all' && (
              <div className="mt-2">
                <Button
                  variant="ghost"
                  size="1"
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs text-gray-600 hover:text-red-600"
                >
                  IŠVALYTI VISUS
                </Button>
              </div>
            )}
          </div>

          {/* Filter Sections */}
          <div className="p-4 space-y-6">
            {/* Categories Filter */}
            <div>
              <div className="mb-3">
                <Text size="3" weight="bold" className="text-gray-900 uppercase tracking-wide">
                  Kategorijos
                </Text>
              </div>
              
              <div className="space-y-1">
                {/* All Categories Option */}
                <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'all'}
                      onChange={() => {
                        setSelectedCategory('all')
                        setSidebarOpen(false)
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <Text size="2" className="text-gray-700">
                      Visi spąstai
                    </Text>
                  </div>
                  <Badge variant="soft" color="gray" size="1">
                    {products.length}
                  </Badge>
                </label>

                {/* Individual Categories */}
                {categories.map((category) => {
                  const categoryCount = products.filter(p => 
                    p.categories?.some(c => c.id === category.id)
                  ).length
                  
                  return (
                    <label key={category.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category.id}
                          onChange={() => {
                            setSelectedCategory(category.id)
                            setSidebarOpen(false)
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div>
                          <Text size="2" className="text-gray-700 block">
                            {category.name}
                          </Text>
                          {category.description && (
                            <Text size="1" className="text-gray-500 mt-0.5 line-clamp-1">
                              {category.description}
                            </Text>
                          )}
                        </div>
                      </div>
                      <Badge 
                        variant="soft" 
                        color={selectedCategory === category.id ? "blue" : "gray"} 
                        size="1"
                      >
                        {categoryCount}
                      </Badge>
                    </label>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* View Mode Filter */}
            <div>
              <div className="mb-3">
                <Text size="3" weight="bold" className="text-gray-900 uppercase tracking-wide">
                  Peržiūra
                </Text>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'solid' : 'outline'}
                  onClick={() => setViewMode('grid')}
                  size="2"
                  className="flex items-center justify-center gap-2"
                >
                  <Grid className="w-4 h-4" />
                  <Text size="1">Tinklelis</Text>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'solid' : 'outline'}
                  onClick={() => setViewMode('list')}
                  size="2"
                  className="flex items-center justify-center gap-2"
                >
                  <List className="w-4 h-4" />
                  <Text size="1">Sąrašas</Text>
                </Button>
              </div>
            </div>

            <Separator />

            {/* Price Range (placeholder for future) */}
            <div>
              <div className="mb-3">
                <Text size="3" weight="bold" className="text-gray-900 uppercase tracking-wide">
                  Kaina
                </Text>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  <Text size="2" className="text-gray-700">Iki €50</Text>
                </label>
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  <Text size="2" className="text-gray-700">€50 - €100</Text>
                </label>
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  <Text size="2" className="text-gray-700">Virš €100</Text>
                </label>
              </div>
            </div>

            <Separator />

            {/* Availability */}
            <div>
              <div className="mb-3">
                <Text size="3" weight="bold" className="text-gray-900 uppercase tracking-wide">
                  Prieinamumas
                </Text>
              </div>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <Text size="2" className="text-gray-700">Tik sandėlyje esantys</Text>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="2"
                onClick={() => setSelectedCategory('all')}
                className="text-xs"
              >
                IŠVALYTI
              </Button>
              <Button 
                variant="solid" 
                size="2"
                onClick={() => setSidebarOpen(false)}
                style={{ backgroundColor: brandColors.primary }}
                className="text-xs"
              >
                PERŽIŪRĖTI ({products.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header for current category */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <Heading size="6" className="mb-1" style={{ color: brandColors.primary }}>
                  {selectedCategory === 'all' ? 'Visi spąstai' : selectedCategoryData?.name}
                </Heading>
                <Text size="3" color="gray">
                  Rasta {products.length} produktų
                </Text>
              </div>
              
              {/* Filter button for mobile */}
              <Button
                variant="outline"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtrai
              </Button>
            </div>
          </div>

          {/* Products Grid/List */}
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-xl text-gray-500 mb-2">Produktai neprieinami</div>
              <Text color="gray">Šioje kategorijoje nėra produktų</Text>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }>
              {products.map((product) => {
                const mainVariant = product.variants?.[0];
                
                // Simplified price calculation
                let price = 0;
                if (mainVariant?.prices && mainVariant.prices.length > 0) {
                  const eurPrice = mainVariant.prices.find((p: any) => 
                    p.currency_code === 'eur' || p.currency_code === 'EUR'
                  );
                  price = eurPrice?.amount || mainVariant.prices[0]?.amount || 0;
                }
                
                const formattedPrice = price > 1000 ? `€${(price / 100).toFixed(2)}` : `€${price.toFixed(2)}`;

                return (
                  <Link key={product.id} href={`/products/${product.handle}`}>
                    <div className="group hover:shadow-lg transition-all duration-300 bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer">
                      {viewMode === 'grid' ? (
                        <div>
                          {/* Product Image */}
                          <div className="aspect-square bg-gray-100 overflow-hidden relative">
                            {(() => {
                              // Use thumbnail if available, otherwise use first image, otherwise fallback
                              let imageUrl = product.thumbnail;
                              
                              // If no thumbnail but images exist, use the first image
                              if (!imageUrl && product.images && product.images.length > 0) {
                                // Sort images by rank and get the first one
                                const sortedImages = [...product.images].sort((a, b) => a.rank - b.rank);
                                imageUrl = sortedImages[0].url;
                              }
                              
                              if (imageUrl) {
                                return (
                                  <Image
                                    src={getOptimizedImageUrl(imageUrl)}
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                );
                              } else {
                                return (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <ShoppingCart className="w-12 h-12" />
                                  </div>
                                );
                              }
                            })()}
                          </div>

                          {/* Product Content */}
                          <div className="p-4">
                            {/* Product Title */}
                            <h3 className="text-lg font-medium leading-tight mb-2 line-clamp-2" style={{ color: brandColors.primary }}>
                              {product.title}
                            </h3>
                          
                            {product.description && (
                              <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {product.description}
                              </div>
                            )}

                            {/* Categories */}
                            {product.categories && product.categories.length > 0 && (
                              <div className="flex gap-1 mb-3">
                                {product.categories.slice(0, 2).map((category: any) => (
                                  <span key={category.id} className="px-2 py-1 bg-gray-100 text-xs rounded">
                                    {category.name}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Price and Add to Cart */}
                            <div className="flex justify-between items-center">
                              <span className="text-xl font-bold" style={{ color: brandColors.primary }}>
                                {formattedPrice}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  mainVariant && handleAddToCart(mainVariant.id);
                                }}
                                disabled={cartLoading || !mainVariant}
                                className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                                style={{ backgroundColor: brandColors.primary }}
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Į krepšelį
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* List View */
                        <div className="flex p-4 gap-4">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                            {(() => {
                              // Use thumbnail if available, otherwise use first image, otherwise fallback
                              let imageUrl = product.thumbnail;
                              
                              // If no thumbnail but images exist, use the first image
                              if (!imageUrl && product.images && product.images.length > 0) {
                                // Sort images by rank and get the first one
                                const sortedImages = [...product.images].sort((a, b) => a.rank - b.rank);
                                imageUrl = sortedImages[0].url;
                              }
                              
                              if (imageUrl) {
                                return (
                                  <Image
                                    src={getOptimizedImageUrl(imageUrl)}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                  />
                                );
                              } else {
                                return (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <ShoppingCart className="w-8 h-8" />
                                  </div>
                                );
                              }
                            })()}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-medium mb-1" style={{ color: brandColors.primary }}>
                              {product.title}
                            </h3>
                            
                            {product.description && (
                              <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {product.description}
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center">
                              <span className="text-xl font-bold" style={{ color: brandColors.primary }}>
                                {formattedPrice}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  mainVariant && handleAddToCart(mainVariant.id);
                                }}
                                disabled={cartLoading || !mainVariant}
                                className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                                style={{ backgroundColor: brandColors.primary }}
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Į krepšelį
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}