"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import { Container, Heading, Text, Button, Flex, Box, Separator } from "@radix-ui/themes"
import { ChevronLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import CheckoutSteps from "@/components/checkout/CheckoutSteps"
import AddressForm from "@/components/checkout/AddressForm"
import ShippingMethods from "@/components/checkout/ShippingMethods"
import PaymentForm from "@/components/checkout/PaymentForm"
import OrderReview from "@/components/checkout/OrderReview"

const CHECKOUT_STEPS = [
  { id: "address", label: "Shipping Address", number: 1 },
  { id: "shipping", label: "Shipping Method", number: 2 },
  { id: "payment", label: "Payment", number: 3 },
  { id: "review", label: "Review Order", number: 4 }
]

export default function CheckoutPage() {
  const { cart, isLoading } = useCart()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [checkoutData, setCheckoutData] = useState({
    email: "",
    shippingAddress: null,
    billingAddress: null,
    shippingMethod: null,
    paymentMethod: null,
  })

  useEffect(() => {
    if (!isLoading && (!cart || cart.items.length === 0)) {
      router.push("/cart")
    }
  }, [cart, isLoading, router])

  if (isLoading) {
    return (
      <Container size="3" className="py-16">
        <Flex direction="column" align="center" gap="4">
          <Text>Loading checkout...</Text>
        </Flex>
      </Container>
    )
  }

  if (!cart || cart.items.length === 0) {
    return null
  }

  const handleNextStep = () => {
    if (currentStep < CHECKOUT_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleUpdateData = (data: any) => {
    setCheckoutData(prev => ({ ...prev, ...data }))
  }

  const subtotal = cart.items.reduce((acc, item) => {
    return acc + (item.unit_price || 0) * item.quantity
  }, 0)

  return (
    <Container size="4" className="py-8">
      <Flex align="center" gap="2" className="mb-8">
        <Link href="/cart">
          <Button variant="ghost" size="2">
            <ChevronLeft size={16} />
            Back to cart
          </Button>
        </Link>
      </Flex>

      <Heading size="8" className="mb-8">Checkout</Heading>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutSteps 
            steps={CHECKOUT_STEPS} 
            currentStep={currentStep} 
            onStepClick={setCurrentStep}
          />

          <Box className="mt-8">
            {currentStep === 0 && (
              <AddressForm 
                onNext={handleNextStep}
                onUpdate={handleUpdateData}
                initialData={checkoutData}
              />
            )}

            {currentStep === 1 && (
              <ShippingMethods
                cart={cart}
                onNext={handleNextStep}
                onBack={handlePreviousStep}
                onUpdate={handleUpdateData}
                selectedMethod={checkoutData.shippingMethod}
              />
            )}

            {currentStep === 2 && (
              <PaymentForm
                cart={cart}
                onNext={handleNextStep}
                onBack={handlePreviousStep}
                onUpdate={handleUpdateData}
                checkoutData={checkoutData}
              />
            )}

            {currentStep === 3 && (
              <OrderReview
                cart={cart}
                checkoutData={checkoutData}
                onBack={handlePreviousStep}
              />
            )}
          </Box>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <Box className="border rounded-lg p-6 sticky top-4">
            <Heading size="5" className="mb-4">Order Summary</Heading>
            
            <Flex direction="column" gap="3">
              {/* Cart Items */}
              <Box className="space-y-3 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <Flex key={item.id} justify="between" align="start" gap="3">
                    <Box className="flex-1">
                      <Text size="2" weight="medium">
                        {item.product?.title || "Product"}
                      </Text>
                      <Text size="1" color="gray">
                        Qty: {item.quantity}
                      </Text>
                    </Box>
                    <Text size="2" weight="medium">
                      €{((item.unit_price || 0) * item.quantity).toFixed(2)}
                    </Text>
                  </Flex>
                ))}
              </Box>

              <Separator size="4" />

              {/* Totals */}
              <Flex justify="between">
                <Text>Subtotal</Text>
                <Text weight="medium">€{subtotal.toFixed(2)}</Text>
              </Flex>
              
              <Flex justify="between">
                <Text>Shipping</Text>
                <Text color="gray">
                  {checkoutData.shippingMethod 
                    ? `€${(checkoutData.shippingMethod.amount / 100).toFixed(2)}`
                    : "Calculated at next step"
                  }
                </Text>
              </Flex>
              
              <Flex justify="between">
                <Text>Tax</Text>
                <Text color="gray">Calculated at payment</Text>
              </Flex>
              
              <Separator size="4" />
              
              <Flex justify="between">
                <Text size="4" weight="bold">Total</Text>
                <Text size="4" weight="bold">
                  €{(subtotal + (checkoutData.shippingMethod?.amount || 0) / 100).toFixed(2)}
                </Text>
              </Flex>
            </Flex>
          </Box>
        </div>
      </div>
    </Container>
  )
}