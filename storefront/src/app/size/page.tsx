"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Box, Heading, Text, Button, Flex, Card, Badge, Tabs, Container } from '@radix-ui/themes'
import { ShoppingCart, Info, Ruler, Zap } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { brandColors } from '@/utils/colors'
import { getOptimizedImageUrl } from '@/utils/image'
import { STORE_API_URL, CART_API_URL, MEDUSA_PUBLISHABLE_KEY } from '@/lib/config'

// Use any type to match the actual Medusa response structure
interface Product {
  id: string
  title: string
  description?: string
  thumbnail?: string
  images?: Array<{
    id: string
    url: string
    rank: number
  }>
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
  
  const { refreshCart, isLoading: cartLoading } = useCart()

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

  const filterProductsBySize = (size: string) => {
    // For now, distribute products evenly across categories
    // In a real implementation, this would be based on product metadata
    const productsPerCategory = Math.ceil(products.length / 3)
    const startIndex = size === 'small' ? 0 : size === 'medium' ? productsPerCategory : productsPerCategory * 2
    return products.slice(startIndex, startIndex + productsPerCategory)
  }

  if (loading) {
    return (
      <Box className="container mx-auto" p="4" py="8">
        <Box className="text-center">
          <Text>Kraunami produktai...</Text>
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box className="container mx-auto" p="4" py="8">
        <Box className="text-center">
          <Text color="red">Klaida: {error}</Text>
        </Box>
      </Box>
    )
  }

  return (
    <Container size="4" className="py-8">
      {/* Header Section */}
      <Box className="text-center mb-8">
        <Heading size="8" className="mb-4" style={{ color: brandColors.primary }}>
          Parinkite spąstą pagal gyvūno dydį
        </Heading>
        <Text className="text-lg max-w-3xl mx-auto mb-6">
          Humaniški gyvūnų spąstai skirtingų dydžių gyvūnams. 
          Pasirinkite tinkamą kategoriją ir raskite idealų sprendimą.
        </Text>
        
        <div className="flex flex-wrap justify-center gap-2">
          <Badge size="2" style={{ backgroundColor: `${brandColors.primary}20`, color: brandColors.primary }}>
            100% Humaniška
          </Badge>
          <Badge size="2" style={{ backgroundColor: "#10B98120", color: "#10B981" }}>
            Efektyvu ir saugu
          </Badge>
          <Badge size="2" style={{ backgroundColor: "#F59E0B20", color: "#F59E0B" }}>
            Profesionalus sprendimas
          </Badge>
        </div>
      </Box>

      {/* Size Categories Tabs */}
      <Box className="mb-8">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {Object.entries(animalSizeCategories).map(([key, category]) => (
              <Tabs.Trigger 
                key={key} 
                value={key} 
                className="text-center border rounded-lg hover:shadow-md transition-all p-4 bg-white"
              >
                <Box className="text-3xl mb-2">{category.icon}</Box>
                <Heading size="4" className="mb-2" style={{ color: category.color }}>
                  {category.title}
                </Heading>
                <Text size="2" color="gray" className="mb-3">
                  {category.description}
                </Text>
                <Box className="flex flex-wrap justify-center gap-1">
                  {category.examples.slice(0, 3).map((example, i) => (
                    <Badge key={i} size="1" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                      {example}
                    </Badge>
                  ))}
                </Box>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {Object.entries(animalSizeCategories).map(([key, category]) => (
            <Tabs.Content key={key} value={key}>
              {/* Category Header */}
              <Box className="mb-6 p-6 rounded-xl" style={{ backgroundColor: `${category.color}10` }}>
                <Flex align="center" gap="4" className="mb-4">
                  <Box className="text-4xl">{category.icon}</Box>
                  <Box>
                    <Heading size="6" className="mb-2" style={{ color: category.color }}>
                      {category.title}
                    </Heading>
                    <Text size="3" color="gray">
                      Idealūs spąstai: {category.description}
                    </Text>
                  </Box>
                </Flex>
                
                <Flex wrap="wrap" gap="2">
                  <Text size="2" weight="medium" color="gray">Tinka šiems gyvūnams:</Text>
                  {category.examples.map((example, i) => (
                    <Badge key={i} size="2" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                      {example}
                    </Badge>
                  ))}
                </Flex>
              </Box>

                {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(0, 6).map((product) => (
                  <Card key={product.id} size="2" className="p-4 hover:shadow-lg transition-shadow">
                    <Link href={`/products/${product.handle}`}>
                      <Flex direction="column" gap="3">
                        <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                          {product.thumbnail ? (
                            <Image
                              src={product.thumbnail}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Flex align="center" justify="center" className="h-full">
                              <Text color="gray">Nuotrauka neprieinama</Text>
                            </Flex>
                          )}
                        </div>
                        
                        <Box>
                          <Heading size="4" weight="medium" className="mb-2">
                            {product.title}
                          </Heading>
                          
                          <Text size="2" color="gray" className="mb-3 line-clamp-2">
                            {product.description}
                          </Text>
                          
                          <Flex justify="between" align="center">
                            <Text size="3" weight="bold" style={{ color: category.color }}>
                              €{(product.variants?.[0]?.prices?.[0]?.amount / 100).toFixed(2)}
                            </Text>
                            <Button size="2" style={{ backgroundColor: category.color }}>
                              Peržiūrėti
                            </Button>
                          </Flex>
                        </Box>
                      </Flex>
                    </Link>
                  </Card>
                ))}
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Box>
    </Container>
  );
}