"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Box, Heading, Text, Button, Flex, Card, Badge, Tabs } from '@radix-ui/themes'
import { ShoppingCart, Info, Ruler, Zap } from 'lucide-react'
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
  metadata?: any
  [key: string]: any
}

const animalSizeCategories = {
  small: {
    title: "Maži gyvūnai", 
    description: "Pelės, žiurkės, voverės, šeškai",
    icon: "🐁",
    color: "#10B981",
    examples: ["Pelės", "Žiurkės", "Voverės", "Šeškai", "Ežiukai", "Smulkūs graužikai"]
  },
  medium: {
    title: "Vidutiniai gyvūnai", 
    description: "Katės, šunys, kiškiai, ežiai",
    icon: "🐱",
    color: "#F59E0B",
    examples: ["Katės", "Šunys", "Kiškiai", "Ežiai", "Šuniukai", "Kačiukai"]
  },
  large: {
    title: "Dideli gyvūnai",
    description: "Barsukai, lapės, vilkai, elniai",
    icon: "🦝",
    color: "#EF4444",
    examples: ["Barsukai", "Lapės", "Vilkai", "Elniai", "Dideli šunys", "Kiti stambesni gyvūnai"]
  }
}

export default function SizePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('small')
  
  const { addToCart, isLoading: cartLoading } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        console.log('Size page - API response:', data)
        console.log('Size page - Products length:', data.products?.length || 0)
        
        // Handle both old and new API response formats
        if (data.success !== false) {
          setProducts(data.products || data || [])
          console.log('Size page - Set products:', data.products?.length || 0, 'items')
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
      await addToCart(variantId, 1)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const filterProductsBySize = (size: string) => {
    // For now, distribute products evenly across categories
    // In a real implementation, this would be based on product metadata
    const productsPerCategory = Math.ceil(products.length / 3)
    const startIndex = size === 'small' ? 0 : size === 'medium' ? productsPerCategory : productsPerCategory * 2
    return products.slice(startIndex, startIndex + productsPerCategory)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Text>Kraunami produktai...</Text>
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
      <div className="mb-8 text-center">
        <Heading size="8" className="mb-4" style={{ color: brandColors.primary }}>
          Spąstai pagal gyvūno dydį
        </Heading>
        <Text size="4" color="gray" className="mb-6 max-w-2xl mx-auto">
          Parinkite tinkamą spąstą pagal gyvūno dydį. Kiekvienas spąstas specialiai sukurtas tam tikro dydžio gyvūnams.
        </Text>
      </div>

      {/* Size Categories */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <Tabs.List className="grid w-full grid-cols-3 gap-4 mb-8">
          {Object.entries(animalSizeCategories).map(([key, category]) => (
            <Tabs.Trigger key={key} value={key} className="p-6 text-center border rounded-lg hover:shadow-md transition-all">
              <div className="text-4xl mb-3">{category.icon}</div>
              <Heading size="4" className="mb-2" style={{ color: category.color }}>
                {category.title}
              </Heading>
              <Text size="2" color="gray" className="mb-3">
                {category.description}
              </Text>
              <div className="flex flex-wrap justify-center gap-1">
                {category.examples.slice(0, 3).map((example, i) => (
                  <Badge key={i} size="1" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                    {example}
                  </Badge>
                ))}
              </div>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {Object.entries(animalSizeCategories).map(([key, category]) => (
          <Tabs.Content key={key} value={key}>
            {/* Category Header */}
            <div className="mb-6 p-6 rounded-xl" style={{ backgroundColor: `${category.color}10` }}>
              <Flex align="center" gap="4" className="mb-4">
                <div className="text-5xl">{category.icon}</div>
                <div>
                  <Heading size="6" className="mb-2" style={{ color: category.color }}>
                    {category.title}
                  </Heading>
                  <Text size="3" color="gray">
                    Idealūs spąstai: {category.description}
                  </Text>
                </div>
              </Flex>
              
              <div className="flex flex-wrap gap-2">
                <Text size="2" weight="medium" color="gray">Tinka šiems gyvūnams:</Text>
                {category.examples.map((example, i) => (
                  <Badge key={i} size="2" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                    {example}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filterProductsBySize(key).map((product) => {
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

                      {/* Product Specs */}
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Tinkamas {category.description.toLowerCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Humaniška konstrukcija
                          </span>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <span 
                        className="inline-block px-2 py-1 text-xs rounded mb-3" 
                        style={{ backgroundColor: `${category.color}20`, color: category.color }}
                      >
                        {category.title}
                      </span>

                      {/* Price and Add to Cart */}
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold" style={{ color: brandColors.primary }}>
                          {formattedPrice}
                        </span>
                        <button
                          onClick={() => mainVariant && handleAddToCart(mainVariant.id)}
                          disabled={cartLoading || !mainVariant}
                          className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                          style={{ backgroundColor: category.color }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Į krepšelį
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {filterProductsBySize(key).length === 0 && (
              <div className="text-center py-12">
                <div className="text-xl text-gray-500">
                  Šiai kategorijai produktų kol kas nėra
                </div>
              </div>
            )}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  )
}