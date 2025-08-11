"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Heading, Text, Button, TextField, Select, Badge } from '@radix-ui/themes'
import { Search, Filter, Grid, List, ShoppingCart, X, TrendingUp } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { brandColors } from '@/utils/colors'
import { getOptimizedImageUrl } from '@/utils/image'
import { STORE_API_URL, CART_API_URL, MEDUSA_PUBLISHABLE_KEY } from '@/lib/config'


interface Product {
  id: string
  title: string
  description?: string
  thumbnail?: string
  variants?: any[]
  categories?: any[]
  [key: string]: any
}

const popularSearches = [
  'katės spąstai',
  'šunų spąstai', 
  'pelių spąstai',
  'graužikų spąstai',
  'humaniški spąstai',
  'dideli spąstai',
  'maži spąstai'
]

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams?.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState('all')
  const [category, setCategory] = useState('all')
  
  const { refreshCart, isLoading: cartLoading } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${STORE_API_URL}/products`, {
          headers: {
            'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success !== false) {
          const allProducts = data.products || data || []
          setProducts(allProducts)
          
          // Filter products based on search query
          if (searchQuery.trim()) {
            const filtered = allProducts.filter((product: Product) =>
              product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredProducts(filtered)
          } else {
            setFilteredProducts(allProducts)
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    // Filter products when search query changes
    if (searchQuery.trim()) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchQuery, products])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by useEffect
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

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        const priceA = a.variants?.[0]?.prices?.[0]?.amount || 0
        const priceB = b.variants?.[0]?.prices?.[0]?.amount || 0
        return priceA - priceB
      case 'price-high':
        const priceA2 = a.variants?.[0]?.prices?.[0]?.amount || 0
        const priceB2 = b.variants?.[0]?.prices?.[0]?.amount || 0
        return priceB2 - priceA2
      case 'name':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <Heading size="7" className="mb-4" style={{ color: brandColors.primary }}>
          Paieška
        </Heading>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4 max-w-2xl">
            <div className="flex-1">
              <TextField.Root
                size="3"
                placeholder="Ieškoti gyvūnų spąstų..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              >
                <TextField.Slot>
                  <Search className="w-4 h-4" style={{ color: brandColors.textTertiary }} />
                </TextField.Slot>
                {searchQuery && (
                  <TextField.Slot>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <X className="w-4 h-4" style={{ color: brandColors.textTertiary }} />
                    </button>
                  </TextField.Slot>
                )}
              </TextField.Root>
            </div>
            <Button 
              type="submit" 
              size="3"
              style={{ backgroundColor: brandColors.primary, color: 'white' }}
            >
              <Search className="w-4 h-4" />
              Ieškoti
            </Button>
          </div>
        </form>

        {/* Popular Searches */}
        {!searchQuery && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4" style={{ color: brandColors.textSecondary }} />
              <Text size="3" weight="medium" style={{ color: brandColors.textSecondary }}>
                Populiarūs paieškos terminai:
              </Text>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Heading size="5" className="mb-1" style={{ color: brandColors.primary }}>
                Paieškos rezultatai
              </Heading>
              <Text size="3" color="gray">
                {loading ? 'Ieškoma...' : `Rasta ${filteredProducts.length} produktų užklausai "${searchQuery}"`}
              </Text>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <Select.Root value={sortBy} onValueChange={setSortBy}>
                <Select.Trigger placeholder="Rūšiuoti" />
                <Select.Content>
                  <Select.Item value="relevance">Aktualumas</Select.Item>
                  <Select.Item value="price-low">Kaina: mažiausia</Select.Item>
                  <Select.Item value="price-high">Kaina: didžiausia</Select.Item>
                  <Select.Item value="name">Pavadinimas</Select.Item>
                </Select.Content>
              </Select.Root>
              
              <div className="flex gap-2">
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
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <Text>Kraunama...</Text>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <Heading size="5" className="mb-2" style={{ color: brandColors.textSecondary }}>
                Nieko nerasta
              </Heading>
              <Text size="3" color="gray" className="mb-4">
                Neradome produktų, atitinkančių jūsų paieškos užklausą "{searchQuery}"
              </Text>
              <Text size="3" color="gray">
                Patarimai:
              </Text>
              <ul className="text-sm text-gray-600 mt-2 max-w-md mx-auto text-left">
                <li>• Patikrinkite rašybą</li>
                <li>• Naudokite trumpesnius raktinius žodžius</li>
                <li>• Pabandykite sinonimus (pvz., "gaudyklės" vietoj "spąstai")</li>
                <li>• Naudokite bendresnį terminą</li>
              </ul>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }>
              {sortedProducts.map((product) => {
                const mainVariant = product.variants?.[0]
                
                // Use the same price calculation as other pages
                let price = 0
                if (mainVariant?.calculated_price?.calculated_amount) {
                  price = mainVariant.calculated_price.calculated_amount
                } else if (mainVariant?.prices && mainVariant.prices.length > 0) {
                  const eurPrice = mainVariant.prices.find((p: any) => 
                    p.currency_code === 'eur' || p.currency_code === 'EUR'
                  )
                  price = eurPrice?.amount || mainVariant.prices[0]?.amount || 0
                }
                
                const formattedPrice = price > 1000 ? `€${(price / 100).toFixed(2)}` : `€${price.toFixed(2)}`

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
                                <Badge key={category.id} size="1" className="bg-gray-100 text-gray-700">
                                  {category.name}
                                </Badge>
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
                              className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
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
                            <div className="text-sm text-gray-600 mb-2 line-clamp-2">
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
                              className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
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
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Text>Loading search...</Text>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}