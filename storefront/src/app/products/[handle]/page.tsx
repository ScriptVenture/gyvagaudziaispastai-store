"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Container, Heading, Text, Button, Flex, Card, Badge, Separator } from '@radix-ui/themes'
import { ShoppingCart, ArrowLeft, Heart, Share, Star } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { getProduct } from '@/lib/medusa'
import { brandColors } from '@/utils/colors'
import { getOptimizedImageUrl } from '@/utils/image'

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
  variants?: Array<{
    id: string
    title: string
    prices: Array<{
      amount: number
      currency_code: string
    }>
  }>
  categories?: Array<{
    id: string
    name: string
  }>
}

export default function ProductPage() {
  const params = useParams()
  const handle = params.handle as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  
  const { refreshCart, isLoading: cartLoading } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return
      
      try {
        setLoading(true)
        const fetchedProduct = await getProduct(handle)
        setProduct(fetchedProduct)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [handle])

  const handleAddToCart = async () => {
    if (!product?.variants?.[0]) return
    
    try {
      // Add to cart logic here - you'll need to implement this
      await refreshCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  if (loading) {
    return (
      <Container size="4" className="py-8">
        <div className="text-center">
          <Text>Kraunamas produktas...</Text>
        </div>
      </Container>
    )
  }

  if (!product) {
    return (
      <Container size="4" className="py-8">
        <div className="text-center">
          <Text>Produktas nerastas</Text>
        </div>
      </Container>
    )
  }

  const mainVariant = product.variants?.[0]
  let price = 0
  if (mainVariant?.prices && mainVariant.prices.length > 0) {
    const eurPrice = mainVariant.prices.find((p) => 
      p.currency_code === 'eur' || p.currency_code === 'EUR'
    )
    price = eurPrice?.amount || mainVariant.prices[0]?.amount || 0
  }
  
  const formattedPrice = price > 1000 ? `€${(price / 100).toFixed(2)}` : `€${price.toFixed(2)}`

  const productImages = product.images && product.images.length > 0 
    ? [...product.images].sort((a, b) => a.rank - b.rank)
    : []

  return (
    <Container size="4" className="py-8">
      {/* Back Button */}
      <Button variant="ghost" size="2" className="mb-6" onClick={() => window.history.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Grįžti atgal
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
            {productImages.length > 0 ? (
              <Image
                src={getOptimizedImageUrl(productImages[selectedImage]?.url || product.thumbnail || '')}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : product.thumbnail ? (
              <Image
                src={getOptimizedImageUrl(product.thumbnail)}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ShoppingCart className="w-16 h-16" />
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {productImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {productImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={getOptimizedImageUrl(image.url)}
                    alt={product.title}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Categories */}
          {product.categories && product.categories.length > 0 && (
            <div className="flex gap-2">
              {product.categories.map((category) => (
                <Badge key={category.id} size="2" variant="soft">
                  {category.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Title and Price */}
          <div>
            <Heading size="7" className="mb-2" style={{ color: brandColors.primary }}>
              {product.title}
            </Heading>
            <Text size="6" weight="bold" style={{ color: brandColors.primary }}>
              {formattedPrice}
            </Text>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <Heading size="4" className="mb-3">Aprašymas</Heading>
              <Text size="3" className="leading-relaxed text-gray-700">
                {product.description}
              </Text>
            </div>
          )}

          <Separator size="4" />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div>
              <Text size="3" weight="medium" className="mb-2 block">Kiekis</Text>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="2"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Text size="3" weight="medium" className="min-w-[2rem] text-center">
                  {quantity}
                </Text>
                <Button
                  variant="outline"
                  size="2"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              size="4"
              className="w-full"
              style={{ backgroundColor: brandColors.primary }}
              onClick={handleAddToCart}
              disabled={cartLoading || !mainVariant}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Įdėti į krepšelį
            </Button>
          </div>

          {/* Additional Actions */}
          <div className="flex gap-3">
            <Button variant="outline" size="3" className="flex-1">
              <Heart className="w-4 h-4 mr-2" />
              Mėgstami
            </Button>
            <Button variant="outline" size="3" className="flex-1">
              <Share className="w-4 h-4 mr-2" />
              Dalintis
            </Button>
          </div>

          {/* Product Features */}
          <Card size="2" className="p-4">
            <Heading size="4" className="mb-3">Produkto savybės</Heading>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <Text size="2">Aukštos kokybės medžiagos</Text>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <Text size="2">Humaniškas gyvūnų gaudymas</Text>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <Text size="2">Ilgalaikis naudojimas</Text>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <Text size="2">Lengvas valymas ir priežiūra</Text>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  )
}
