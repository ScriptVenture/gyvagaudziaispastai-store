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
import { useTranslation } from "@/hooks/useTranslation"

// Steps are now defined in CheckoutSteps component with Lithuanian translations

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { cart, isLoading } = useCart()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
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
          <Text>{t('loading')}</Text>
        </Flex>
      </Container>
    )
  }

  if (!cart || cart.items.length === 0) {
    return null
  }

  const handleNextStep = () => {
    if (currentStep < 4) { // 4 total steps
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) { // Minimum step is 1
      setCurrentStep(currentStep - 1)
    }
  }

  const handleUpdateData = (data: any) => {
    console.log('🔍 handleUpdateData called with:', data)
    setCheckoutData(prev => {
      const updated = { ...prev, ...data }
      console.log('🔍 Updated checkoutData:', updated)
      if (data.shippingMethod) {
        console.log('🔍 Shipping method details:', data.shippingMethod)
        console.log('🔍 Available amount fields:', {
          calculated_amount: data.shippingMethod.calculated_amount,
          'data.calculated_amount': data.shippingMethod.data?.calculated_amount,
          'data.amount': data.shippingMethod.data?.amount,
          amount: data.shippingMethod.amount
        })
      }
      return updated
    })
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
            {t('cart.backToShopping')}
          </Button>
        </Link>
      </Flex>

      <Heading size="8" className="mb-8">{t('checkout.title')}</Heading>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutSteps 
            currentStep={currentStep} 
            onStepClick={setCurrentStep}
          />

          <Box className="mt-8">
            {currentStep === 1 && (
              <AddressForm 
                onNext={handleNextStep}
                onUpdate={handleUpdateData}
                initialData={checkoutData}
              />
            )}

            {currentStep === 2 && (
              <ShippingMethods
                cart={cart}
                onNext={handleNextStep}
                onBack={handlePreviousStep}
                onUpdate={handleUpdateData}
                selectedMethod={checkoutData.shippingMethod}
              />
            )}

            {currentStep === 3 && (
              <PaymentForm
                cart={cart}
                onNext={handleNextStep}
                onBack={handlePreviousStep}
                onUpdate={handleUpdateData}
                checkoutData={checkoutData}
              />
            )}

            {currentStep === 4 && (
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
            <Heading size="5" className="mb-4">{t('checkout.review.orderSummary')}</Heading>
            
            <Flex direction="column" gap="3">
              {/* Cart Items */}
              <Box className="space-y-3 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <Flex key={item.id} justify="between" align="start" gap="3">
                    <Box className="flex-1">
                      <Text size="2" weight="medium">
                        {item.product?.title || "Prekė"}
                      </Text>
                      <Text size="1" color="gray">
                        {t('cart.quantity')}: {item.quantity}
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
                <Text>{t('cart.subtotal')}</Text>
                <Text weight="medium">€{subtotal.toFixed(2)}</Text>
              </Flex>
              
              <Flex justify="between">
                <Text>{t('cart.shipping')}</Text>
                <Text weight="medium">
                  {(() => {
                    if (!checkoutData.shippingMethod) {
                      return <Text color="gray">{t('cart.calculatedAtCheckout')}</Text>;
                    }
                    
                    const shippingCost = (
                      checkoutData.shippingMethod.calculated_amount || 
                      checkoutData.shippingMethod.data?.calculated_amount || 
                      checkoutData.shippingMethod.data?.amount || 
                      checkoutData.shippingMethod.amount || 
                      0
                    ) / 100;
                    
                    return `€${shippingCost.toFixed(2)}`;
                  })()}
                </Text>
              </Flex>
              
              <Flex justify="between">
                <Text>{t('cart.tax')}</Text>
                <Text color="gray">{t('cart.calculatedAtPayment')}</Text>
              </Flex>
              
              <Separator size="4" />
              
              <Flex justify="between">
                <Text size="4" weight="bold">{t('cart.total')}</Text>
                <Text size="4" weight="bold">
                  €{(subtotal + ((
                    checkoutData.shippingMethod?.calculated_amount || 
                    checkoutData.shippingMethod?.data?.calculated_amount || 
                    checkoutData.shippingMethod?.data?.amount || 
                    checkoutData.shippingMethod?.amount || 
                    0
                  ) / 100)).toFixed(2)}
                </Text>
              </Flex>
            </Flex>
          </Box>
        </div>
      </div>
    </Container>
  )
}