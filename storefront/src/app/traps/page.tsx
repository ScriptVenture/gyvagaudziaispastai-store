"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Box, Heading, Text, Button, Flex, Card, Badge, Select } from '@radix-ui/themes'
import { ShoppingCart, Grid, List } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { brandColors } from '@/utils/colors'
import { getOptimizedImageUrl } from '@/utils/image'

// Use any type to match the actual Medusa response structure
interface Product {
  id: string
  title: string
  description?: string
  thumbnail?: string
  variants?: any[]
  categories?: any[]
  [key: string]: any
}

export default function TrapsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const { refreshCart, isLoading: cartLoading } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        console.log('Traps page - API response:', data)
        console.log('Traps page - Products length:', data.products?.length || 0)
        
        // Handle both old and new API response formats
        if (data.success !== false) {
          setProducts(data.products || data || [])
          console.log('Traps page - Set products:', data.products?.length || 0, 'items')
        } else {
          throw new Error(data.error || 'Failed to fetch products')
        }
      } catch (err: unknown) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = async (variantId: string) => {
    try {
      const response = await fetch('/api/cart/add', {
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Text>Kraunami gyvūnų spąstai...</Text>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Text color="red">Klaida: {error}</Text>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Heading size="8" className="mb-2" style={{ color: brandColors.primary }}>
          Gyvūnų spąstai
        </Heading>
        <Text size="4" color="gray" className="mb-6">
          Humaniški ir efektyvūs gyvūnų spąstai visų tipų gyvūnams
        </Text>
        
        {/* Filters and Controls */}
        <Flex justify="between" align="center" className="mb-6 flex-wrap gap-4">
          <div className="flex gap-4">
            <Select.Root defaultValue="all">
              <Select.Trigger placeholder="Kategorija" />
              <Select.Content>
                <Select.Item value="all">Visi spąstai</Select.Item>
                <Select.Item value="small">Maži gyvūnai</Select.Item>
                <Select.Item value="medium">Vidutiniai gyvūnai</Select.Item>
                <Select.Item value="large">Dideli gyvūnai</Select.Item>
              </Select.Content>
            </Select.Root>
            
            <Select.Root defaultValue="newest">
              <Select.Trigger placeholder="Rūšiuoti" />
              <Select.Content>
                <Select.Item value="newest">Naujausi</Select.Item>
                <Select.Item value="price-low">Kaina: mažiausia</Select.Item>
                <Select.Item value="price-high">Kaina: didžiausia</Select.Item>
                <Select.Item value="popular">Populiariausi</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          
          <Flex gap="2">
            <Button
              variant={viewMode === 'grid' ? 'solid' : 'outline'}
              onClick={() => setViewMode('grid')}
              size="2"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'solid' : 'outline'}
              onClick={() => setViewMode('list')}
              size="2"
            >
              <List className="w-4 h-4" />
            </Button>
          </Flex>
        </Flex>
      </div>

      {/* Products Grid/List */}
      <div className="mb-4 text-sm text-gray-600">
        Rasta {products.length} produktų
      </div>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-xl text-gray-500">Produktai neprieinami</div>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
        }>
          {products.map((product, index) => {
            const mainVariant = product.variants?.[0];
            
            // Use the same price calculation as main page
            let price = 0;
            if (mainVariant?.calculated_price?.calculated_amount) {
              price = mainVariant.calculated_price.calculated_amount;
            } else if (mainVariant?.prices && mainVariant.prices.length > 0) {
              const eurPrice = mainVariant.prices.find((p: any) => 
                p.currency_code === 'eur' || p.currency_code === 'EUR'
              );
              price = eurPrice?.amount || mainVariant.prices[0]?.amount || 0;
            }
            
            const formattedPrice = price > 1000 ? `€${(price / 100).toFixed(2)}` : `€${price.toFixed(2)}`;

            return (
            <div key={product.id} className="group hover:shadow-lg transition-all duration-300 bg-white rounded-lg border border-gray-200 overflow-hidden">
              {viewMode === 'grid' ? (
                <div>
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    {product.thumbnail ? (
                      <Image
                        src={getOptimizedImageUrl(product.thumbnail)}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingCart className="w-12 h-12" />
                      </div>
                    )}
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
                        onClick={() => mainVariant && handleAddToCart(mainVariant.id)}
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
                    {product.thumbnail ? (
                      <Image
                        src={getOptimizedImageUrl(product.thumbnail)}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-1" style={{ color: brandColors.primary }}>
                      {product.title}
                    </h3>
                    
                    {product.description && (
                      <div className="text-sm text-gray-600 mb-2">
                        {product.description}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold" style={{ color: brandColors.primary }}>
                        {formattedPrice}
                      </span>
                      <button
                        onClick={() => mainVariant && handleAddToCart(mainVariant.id)}
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
            );
          })}
        </div>
      )}
    </div>
  )
}