"use client"

import { useState } from "react"
import { Button, Text, Flex, Box, Heading, Separator } from "@radix-ui/themes"
import { MapPin, Truck, CreditCard, AlertCircle } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
import { removeCartId } from "@/lib/data/cookies"

interface OrderReviewProps {
  cart: HttpTypes.StoreCart
  checkoutData: any
  onBack: () => void
}

export default function OrderReview({ cart, checkoutData, onBack }: OrderReviewProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePlaceOrder = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if this is a Paysera payment
      if (checkoutData.paymentMethod?.id === 'paysera' || checkoutData.paymentProvider?.id === 'paysera') {
        // Handle Paysera payment
        const orderId = `order_${Date.now()}`
        const totalAmount = Math.round(total * 100) // Convert to cents

        const payseraResponse = await fetch('/api/paysera/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            amount: totalAmount,
            currency: cart.region?.currency_code || 'EUR'
          }),
        })

        const payseraData = await payseraResponse.json()

        if (!payseraResponse.ok) {
          throw new Error(payseraData.error || 'Failed to create Paysera payment')
        }

        if (payseraData.success && payseraData.paymentUrl) {
          // Redirect to Paysera payment page
          window.location.href = payseraData.paymentUrl
          return
        } else {
          throw new Error('Failed to create Paysera payment')
        }
      }

      // Handle regular Medusa payments
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
        // Clear cart from client-side cookies
        removeCartId()
        
        // Dispatch cart update event
        window.dispatchEvent(new Event('cart-updated'))
        
        // Redirect to confirmation page
        router.push(`/order/${data.order.id}/confirmation`)
      } else if (data.redirect_url) {
        // For payment gateway redirects
        window.location.href = data.redirect_url
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

  const subtotal = cart.items.reduce((acc, item) => {
    return acc + (item.unit_price || 0) * item.quantity
  }, 0)

  const shippingAmount = checkoutData.shippingMethod?.amount || 0
  const total = subtotal + shippingAmount / 100

  return (
    <div>
      <Heading size="6" className="mb-6">Review Your Order</Heading>

      {/* Shipping Address */}
      <Box className="mb-6">
        <Flex align="center" gap="2" className="mb-3">
          <MapPin size={20} className="text-gray-600" />
          <Text weight="medium">Shipping Address</Text>
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
          <Text weight="medium">Shipping Method</Text>
        </Flex>
        <Box className="pl-7">
          <Text size="2">{checkoutData.shippingMethod?.name}</Text>
          <Text size="2" color="gray" className="block">
            {checkoutData.shippingMethod?.description}
          </Text>
          <Text size="2" weight="medium">
            €{(checkoutData.shippingMethod?.amount / 100).toFixed(2)}
          </Text>
        </Box>
      </Box>

      <Separator size="4" className="my-6" />

      {/* Payment Method */}
      <Box className="mb-6">
        <Flex align="center" gap="2" className="mb-3">
          <CreditCard size={20} className="text-gray-600" />
          <Text weight="medium">Payment Method</Text>
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
        <Text weight="medium" className="mb-3">Order Items</Text>
        <Box className="space-y-3">
          {cart.items.map((item) => (
            <Flex key={item.id} justify="between" align="start">
              <Box>
                <Text size="2">{item.product?.title}</Text>
                <Text size="1" color="gray">Quantity: {item.quantity}</Text>
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
          <Text>Subtotal</Text>
          <Text>€{subtotal.toFixed(2)}</Text>
        </Flex>
        <Flex justify="between" className="mb-2">
          <Text>Shipping</Text>
          <Text>€{(shippingAmount / 100).toFixed(2)}</Text>
        </Flex>
        <Flex justify="between" className="mb-2">
          <Text>Tax</Text>
          <Text color="gray">Included</Text>
        </Flex>
        <Separator size="4" className="my-3" />
        <Flex justify="between">
          <Text size="4" weight="bold">Total</Text>
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
          Back
        </Button>
      
<Button 
          size="3" 
          onClick={handlePlaceOrder} 
          disabled={loading}
        >
          {loading ? "Processing..." : "Place Order"}
        </Button>
      </Flex>
    </div>
  )
}