"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, ArrowRight, CheckCircle } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { brandColors } from '@/utils/colors'
import { getOptimizedImageUrl } from '@/utils/image'
import { STORE_API_URL, MEDUSA_PUBLISHABLE_KEY } from '@/lib/config'

interface Product {
  id: string
  title: string
  description?: string
  thumbnail?: string
  handle: string
  images?: Array<{
    id: string
    url: string
    rank: number
  }>
  variants?: any[]
  metadata?: any
  [key: string]: any
}

const sizeCategories = [
  {
    id: 'small',
    name: 'Smulkūs gyvūnai',
    icon: '🐁',
    description: 'Pelėms, žiurkėms, voveriukams',
    gradient: 'from-green-100 to-emerald-200',
    hoverGradient: 'from-green-200 to-emerald-300',
    borderColor: 'border-green-300',
    textColor: 'text-green-700',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    examples: ['Pelės', 'Žiurkės', 'Voverės', 'Šeškai'],
    sizes: ['XS', 'S']
  },
  {
    id: 'medium',
    name: 'Vidutiniai gyvūnai',
    icon: '🐱',
    description: 'Katėms, triušiams, šeškataupiams',
    gradient: 'from-blue-100 to-cyan-200',
    hoverGradient: 'from-blue-200 to-cyan-300',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    examples: ['Katės', 'Triušiai', 'Šeškataupiams', 'Ežiai'],
    sizes: ['M']
  },
  {
    id: 'large',
    name: 'Stambūs gyvūnai',
    icon: '🦝',
    description: 'Meškėnams, šunims, lapėms',
    gradient: 'from-purple-100 to-violet-200',
    hoverGradient: 'from-purple-200 to-violet-300',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-700',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    examples: ['Meškėnai', 'Šunys', 'Lapės', 'Dideli gyvūnai'],
    sizes: ['L', 'XL', 'XXL']
  }
]

export default function SizePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${STORE_API_URL}/products?fields=*,images.*`, {
          headers: {
            'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setProducts(data.products || [])
        setFilteredProducts(data.products || [])
      } catch (err: unknown) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    const category = sizeCategories.find(cat => cat.id === categoryId)
    
    if (category) {
      // Filter products based on category (you can implement more sophisticated filtering here)
      const filtered = products.filter(product => {
        const title = product.title?.toLowerCase() || ''
        return category.sizes.some(size => 
          title.includes(size.toLowerCase()) || 
          title.includes(`dydis ${size.toLowerCase()}`) ||
          category.examples.some(example => title.includes(example.toLowerCase()))
        )
      })
      setFilteredProducts(filtered.length > 0 ? filtered : products.slice(0, 6))
    }
  }

  const clearFilter = () => {
    setSelectedCategory(null)
    setFilteredProducts(products)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Kraunami produktai...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 lg:mb-6">
            Pasirinkite pagal dydį
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Raskite tinkamą spąstą pagal jūsų reikalingą gyvūno dydį. 
            Spauskite ant gyvūno piktogramos ir pamatykite tinkamus produktus.
          </p>
          
          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700 font-medium">Humaniška</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium">Efektyvu</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <span className="text-gray-700 font-medium">Saugus</span>
            </div>
          </div>
        </div>

        {/* Animal Size Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {sizeCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`
                relative cursor-pointer transform transition-all duration-300 hover:scale-105
                bg-gradient-to-br ${category.gradient} hover:${category.hoverGradient}
                rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-2xl
                border-2 ${selectedCategory === category.id ? 'border-gray-800 ring-4 ring-gray-200' : `${category.borderColor} hover:border-gray-400`}
                min-h-[280px] lg:min-h-[320px] flex flex-col justify-between
              `}
            >
              <div className="text-center">
                <div className="text-6xl lg:text-7xl mb-4 lg:mb-6">{category.icon}</div>
                <h3 className={`text-xl lg:text-2xl font-bold ${category.textColor} mb-3`}>
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm lg:text-base">
                  {category.description}
                </p>
                
                {/* Size badges */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {category.sizes.map((size) => (
                    <span
                      key={size}
                      className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-gray-700"
                    >
                      {size}
                    </span>
                  ))}
                </div>
                
                {/* Examples */}
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Pavyzdžiai: </span>
                  {category.examples.slice(0, 2).join(', ')}
                </div>
              </div>
              
              {/* Selected indicator */}
              {selectedCategory === category.id && (
                <div className="absolute top-4 right-4">
                  <div className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
              )}
              
              {/* Click indicator */}
              <div className="flex items-center justify-center mt-4">
                <div className={`${category.buttonColor} text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2`}>
                  <span>Žiūrėti produktus</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clear Filter Button */}
        {selectedCategory && (
          <div className="text-center mb-8">
            <button
              onClick={clearFilter}
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 font-medium"
            >
              ← Grįžti į visus produktus
            </button>
          </div>
        )}

        {/* Products Grid */}
        {selectedCategory && (
          <div className="bg-white/80 backdrop-blur rounded-3xl p-6 lg:p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                {sizeCategories.find(cat => cat.id === selectedCategory)?.name} produktai
              </h2>
              <p className="text-gray-600">
                Parinkti spąstai {sizeCategories.find(cat => cat.id === selectedCategory)?.description.toLowerCase()}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.slice(0, 8).map((product) => (
                <Link key={product.id} href={`/products/${product.handle}`}>
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
                    <div className="aspect-square relative overflow-hidden">
                      {product.thumbnail ? (
                        <Image
                          src={getOptimizedImageUrl(product.thumbnail)}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <ShoppingCart className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm lg:text-base">
                        {product.title}
                      </h3>
                      {product.variants?.[0]?.prices?.[0] && (
                        <p className="text-lg font-bold text-green-600">
                          €{((product.variants[0].prices[0].amount || 0) / 100).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No Products Message */}
        {selectedCategory && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Produktų nerasta
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Šioje kategorijoje produktų nerasta. Pabandykite kitą kategoriją arba grįžkite į visus produktus.
            </p>
          </div>
        )}
        
        {/* Bottom CTA */}
        {!selectedCategory && (
          <div className="text-center mt-16">
            <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Nežinote, kokio dydžio spąsto reikia?
              </h3>
              <p className="text-gray-600 mb-6">
                Susisiekite su mūsų ekspertais ir gaukite nemokamą konsultaciją
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
                >
                  Susisiekti su ekspertais
                </Link>
                <Link 
                  href="/"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium transition-colors"
                >
                  Žiūrėti visus produktus
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}