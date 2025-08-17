"use client"

import { useState, useEffect } from 'react'
import { Box, Heading, Text, Button, Flex, Card, Badge, Separator, ScrollArea, Container, IconButton } from '@radix-ui/themes'
import { ShoppingCart, Grid, List, Menu, X, Filter, ChevronRight, Tag, Star } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useProducts, Product } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { brandColors } from '@/utils/colors'
import { CART_API_URL } from '@/lib/config'
import ProductCard from '@/components/product/ProductCard'

export default function TrapsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const { refreshCart, isLoading: cartLoading } = useCart()
  const { categories, loading: categoriesLoading } = useCategories()
  const { products: allProducts, loading: productsLoading } = useProducts(selectedCategory === 'all' ? undefined : selectedCategory)

  // Custom hook to fetch tags from product-tags API
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [tagsLoading, setTagsLoading] = useState(true)

  useEffect(() => {
    async function fetchTags() {
      try {
        setTagsLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/product-tags`, {
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          const tags = data.product_tags?.map((tag: any) => tag.value) || []
          setAvailableTags(tags.sort())
        }
      } catch (error) {
        console.error('Error fetching tags:', error)
      } finally {
        setTagsLoading(false)
      }
    }

    fetchTags()
  }, [])

  // Filter products by selected tags
  const products = allProducts.filter(product => {
    if (selectedTags.length === 0) return true;
    return selectedTags.some(selectedTag => 
      product.tags?.some(tag => tag.value.toLowerCase() === selectedTag.toLowerCase())
    );
  });

  // Get all unique tags from products
  const allTags = Array.from(new Set(
    allProducts.flatMap(product => 
      product.tags?.map(tag => tag.value) || []
    )
  )).sort();

  // Debug logging for tags
  if (typeof window !== 'undefined' && allProducts.length > 0) {
    console.log('Debug - All products:', allProducts.length);
    console.log('Debug - Products with tags:', allProducts.filter(p => p.tags && p.tags.length > 0).length);
    console.log('Debug - All tags found:', allTags);
    console.log('Debug - Sample product with tags:', allProducts.find(p => p.tags && p.tags.length > 0));
  }

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
            {(selectedCategory !== 'all' || selectedTags.length > 0) && (
              <div className="mt-2">
                <Button
                  variant="ghost"
                  size="1"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedTags([]);
                  }}
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

            {/* Tags Filter */}
            <div>
              <div className="mb-3">
                <Text size="3" weight="bold" className="text-gray-900 uppercase tracking-wide">
                  Gyvūnų tipai
                </Text>
              </div>
              
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {tagsLoading ? (
                  <div className="p-2 text-center">
                    <Text size="2" className="text-gray-500">Kraunami filtrai...</Text>
                  </div>
                ) : availableTags.length === 0 ? (
                  <div className="p-2 text-center">
                    <Text size="2" className="text-gray-500">Filtrai neprieinami</Text>
                  </div>
                ) : (
                  availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    
                    return (
                      <label key={tag} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTags([...selectedTags, tag]);
                              } else {
                                setSelectedTags(selectedTags.filter(t => t !== tag));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <div>
                            <Text size="2" className="text-gray-700 block">
                              {tag}
                            </Text>
                          </div>
                        </div>
                        <Badge 
                          variant="soft" 
                          color={isSelected ? "blue" : "gray"} 
                          size="1"
                        >
                          ✓
                        </Badge>
                      </label>
                    );
                  })
                )}
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
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedTags([]);
                }}
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
              : 'grid grid-cols-1 gap-4'
            }>
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  variant={viewMode === 'list' ? 'compact' : 'default'}
                  showAddToCart={true}
                  onAddToCart={handleAddToCart}
                  className={viewMode === 'list' ? 'w-full' : ''}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
