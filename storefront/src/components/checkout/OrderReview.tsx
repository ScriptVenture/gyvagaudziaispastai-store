"use client"

import { useState } from "react"
import { Button, Text, Flex, Box, Heading, Separator } from "@radix-ui/themes"
import { MapPin, Truck, CreditCard, AlertCircle } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/useTranslation"

interface OrderReviewProps {
  cart: HttpTypes.StoreCart
  checkoutData: any
  onBack: () => void
}

export default function OrderReview({ cart, checkoutData, onBack }: OrderReviewProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePlaceOrder = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Placing order with payment method:', checkoutData.paymentMethod?.id)
      console.log('Cart total:', total, 'Currency:', cart.region?.currency_code)

      // Use the standard Medusa checkout completion flow
      const response = await fetch('/api/checkout/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: checkoutData.email,
          shippingAddress: checkoutData.shippingAddress,
          billingAddress: checkoutData.billingAddress,
          shippingMethod: checkoutData.shippingMethod,
          paymentMethod: checkoutData.paymentMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete order')
      }

      if (data.success && data.order) {
        // Order was completed successfully (e.g., manual payment)
        console.log('Order completed successfully:', data.order.id)
        
        // Cart is cleared on server-side by the API
        
        // Dispatch cart update event
        window.dispatchEvent(new Event('cart-updated'))
        
        // Redirect to confirmation page
        router.push(`/order/${data.order.id}/confirmation`)
      } else if (data.redirect_url) {
        // Payment requires external redirect (e.g., Paysera)
        console.log('Redirecting to payment gateway:', data.redirect_url)
        window.location.href = data.redirect_url
      } else if (!data.success && data.cart) {
        // Cart still needs payment - this means payment session was created but needs user action
        const paymentSession = data.cart.payment_sessions?.[0]
        if (paymentSession?.data?.payment_url) {
          console.log('Redirecting to Paysera payment:', paymentSession.data.payment_url)
          window.location.href = paymentSession.data.payment_url
        } else {
          setError(data.message || "Payment is required to complete your order.")
        }
      } else {
        setError(data.error || "Failed to complete order. Please try again.")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while placing your order.")
      console.error("Order error:", err)
    } finally {
      setLoading(false)
    }
  }

  const subtotal = cart.items?.reduce((acc, item) => {
    return acc + (item.unit_price || 0) * item.quantity
  }, 0) || 0

  // Handle different shipping method data structures
  const shippingAmount = checkoutData.shippingMethod?.data?.amount || checkoutData.shippingMethod?.amount || 0
  const total = subtotal + (shippingAmount / 100)

  // Debug: Log shipping method structure
  console.log('OrderReview - checkoutData.shippingMethod:', checkoutData.shippingMethod)
  console.log('OrderReview - shippingAmount:', shippingAmount)
  console.log('OrderReview - total:', total)

  return (
    <div>
      <Heading size="6" className="mb-6">{t('checkout.review.reviewYourOrder')}</Heading>

      {/* Shipping Address */}
      <Box className="mb-6">
        <Flex align="center" gap="2" className="mb-3">
          <MapPin size={20} className="text-gray-600" />
          <Text weight="medium">{t('checkout.review.shippingAddress')}</Text>
        </Flex>
        <Box className="pl-7">
          <Text size="2">
            {checkoutData.shippingAddress?.firstName} {checkoutData.shippingAddress?.lastName}
          </Text>
          <Text size="2" className="block">
            {checkoutData.shippingAddress?.address1}
          </Text>
          {checkoutData.shippingAddress?.address2 && (
            <Text size="2" className="block">
              {checkoutData.shippingAddress?.address2}
            </Text>
          )}
          <Text size="2" className="block">
            {checkoutData.shippingAddress?.city}, {checkoutData.shippingAddress?.postalCode}
          </Text>
          <Text size="2" className="block">
            {checkoutData.shippingAddress?.countryCode}
          </Text>
        </Box>
      </Box>

      <Separator size="4" className="my-6" />

      {/* Shipping Method */}
      <Box className="mb-6">
        <Flex align="center" gap="2" className="mb-3">
          <Truck size={20} className="text-gray-600" />
          <Text weight="medium">{t('checkout.review.shippingMethod')}</Text>
        </Flex>
        <Box className="pl-7">
          <Text size="2">{checkoutData.shippingMethod?.name}</Text>
          <Text size="2" color="gray" className="block">
            {checkoutData.shippingMethod?.description}
          </Text>
          <Text size="2" weight="medium">
            €{(shippingAmount / 100).toFixed(2)}
          </Text>
        </Box>
      </Box>

      <Separator size="4" className="my-6" />

      {/* Payment Method */}
      <Box className="mb-6">
        <Flex align="center" gap="2" className="mb-3">
          <CreditCard size={20} className="text-gray-600" />
          <Text weight="medium">{t('checkout.review.paymentMethod')}</Text>
        </Flex>
        <Box className="pl-7">
          <Text size="2">{checkoutData.paymentMethod?.name}</Text>
          <Text size="2" color="gray" className="block">
            {checkoutData.paymentMethod?.description}
          </Text>
        </Box>
      </Box>

      <Separator size="4" className="my-6" />

      {/* Order Items */}
      <Box className="mb-6">
        <Text weight="medium" className="mb-3">{t('checkout.review.orderItems')}</Text>
        <Box className="space-y-3">
          {cart.items?.map((item) => (
            <Flex key={item.id} justify="between" align="start">
              <Box>
                <Text size="2">{item.product?.title}</Text>
                <Text size="1" color="gray">{t('cart.quantity')}: {item.quantity}</Text>
              </Box>
              <Text size="2" weight="medium">
                €{((item.unit_price || 0) * item.quantity).toFixed(2)}
              </Text>
            </Flex>
          ))}
        </Box>
      </Box>

      <Separator size="4" className="my-6" />

      {/* Order Total */}
      <Box className="mb-6">
        <Flex justify="between" className="mb-2">
          <Text>{t('cart.subtotal')}</Text>
          <Text>€{subtotal.toFixed(2)}</Text>
        </Flex>
        <Flex justify="between" className="mb-2">
          <Text>{t('cart.shipping')}</Text>
          <Text>€{(shippingAmount / 100).toFixed(2)}</Text>
        </Flex>
        <Flex justify="between" className="mb-2">
          <Text>{t('cart.tax')}</Text>
          <Text color="gray">{t('checkout.review.taxIncluded')}</Text>
        </Flex>
        <Separator size="4" className="my-3" />
        <Flex justify="between">
          <Text size="4" weight="bold">{t('cart.total')}</Text>
          <Text size="4" weight="bold">€{total.toFixed(2)}</Text>
        </Flex>
      </Box>

      {error && (
        <Flex align="center" gap="2" className="mb-4 p-3 bg-red-50 text-red-600 rounded">
          <AlertCircle size={18} />
          <Text size="2">{error}</Text>
        </Flex>
      )}

      <Flex justify="between">
        <Button size="3" variant="outline" onClick={onBack} disabled={loading}>
          {t('back')}
        </Button>
      
        <Button 
          size="3" 
          onClick={handlePlaceOrder} 
          disabled={loading}
        >
          {loading ? t('checkout.review.processing') : t('checkout.review.placeOrder')}
        </Button>
      </Flex>
    </div>
  )
}