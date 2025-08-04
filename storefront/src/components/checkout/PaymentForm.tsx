"use client"

import { useState, useEffect } from "react"
import { Button, Text, Flex, Box, Heading, RadioGroup } from "@radix-ui/themes"
import { CreditCard, Banknote, Wallet, AlertCircle } from "lucide-react"
import { HttpTypes } from "@medusajs/types"

interface PaymentFormProps {
  cart: HttpTypes.StoreCart
  onNext: () => void
  onBack: () => void
  onUpdate: (data: any) => void
  checkoutData: any
}

const PAYMENT_PROVIDER_ICONS: Record<string, any> = {
  "pp_stripe_stripe": CreditCard,
  "pp_paysera_paysera": Wallet,
  "pp_system_default": Banknote,
  "paysera": Wallet,
  "stripe": CreditCard,
}

export default function PaymentForm({ 
  cart, 
  onNext, 
  onBack, 
  onUpdate,
  checkoutData 
}: PaymentFormProps) {
  const [selected, setSelected] = useState("")
  const [loading, setLoading] = useState(false)
  const [paymentProviders, setPaymentProviders] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get payment providers from cart region and add Paysera
    const providers = cart?.region?.payment_providers || []
    
    // Add Paysera as an additional option
    const allProviders = [
      ...providers,
      {
        id: "paysera",
        name: "Paysera Payment"
      }
    ]
    
    setPaymentProviders(allProviders)
    if (allProviders.length > 0 && !selected) {
      setSelected(allProviders[0].id)
    }
  }, [cart, selected])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      const provider = paymentProviders.find(p => p.id === selected)
      if (!provider) {
        setError("Please select a payment method")
        return
      }

      console.log("Initializing payment session with provider:", selected)

      // Initialize payment session
      const response = await fetch('/api/payment/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider_id: selected }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment session')
      }

      onUpdate({ paymentProvider: provider })
      onNext()
    } catch (err: any) {
      console.error('Error initializing payment:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getProviderName = (providerId: string) => {
    switch (providerId) {
      case "pp_stripe_stripe":
        return "Credit/Debit Card (Stripe)"
      case "pp_paysera_paysera":
        return "Paysera Payment"
      case "paysera":
        return "Paysera Payment"
      case "pp_system_default":
        return "Manual Payment"
      default:
        return providerId.replace("pp_", "").replace("_", " ")
    }
  }

  const getProviderDescription = (providerId: string) => {
    switch (providerId) {
      case "pp_stripe_stripe":
        return "Pay securely with Visa, Mastercard, or American Express"
      case "pp_paysera_paysera":
        return "Pay with Paysera - Bank transfer, cards, and e-wallets"
      case "paysera":
        return "Pay with Paysera - Bank transfer, cards, and e-wallets"
      case "pp_system_default":
        return "Manual payment processing"
      default:
        return "Payment provider"
    }
  }

  if (loading) {
    return (
      <div>
        <Heading size="6" className="mb-6">Payment Method</Heading>
        <Box className="p-8 text-center">
          <Text>Loading payment options...</Text>
        </Box>
      </div>
    )
  }

  return (
    <div>
      <Heading size="6" className="mb-6">Payment Method</Heading>

      {paymentProviders.length === 0 ? (
        <Box className="p-4 bg-gray-50 rounded-lg mb-6">
          <Text color="gray">No payment providers available</Text>
        </Box>
      ) : (
        <RadioGroup.Root value={selected} onValueChange={setSelected}>
          <Flex direction="column" gap="3">
            {paymentProviders.map((provider) => {
              const Icon = PAYMENT_PROVIDER_ICONS[provider.id] || CreditCard
              return (
                <label
                  key={provider.id}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all
                    ${selected === provider.id 
                      ? 'border-green-600 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <Flex align="start" gap="3">
                    <RadioGroup.Item value={provider.id} />
                    <Box className="flex-1">
                      <Flex align="center" gap="2" className="mb-1">
                        <Icon size={20} className="text-gray-600" />
                        <Text weight="medium">{getProviderName(provider.id)}</Text>
                      </Flex>
                      <Text size="2" color="gray">
                        {getProviderDescription(provider.id)}
                      </Text>
                    </Box>
                  </Flex>
                </label>
              )
            })}
          </Flex>
        </RadioGroup.Root>
      )}

      {error && (
        <Flex align="center" gap="2" className="mt-4 p-3 bg-red-50 text-red-600 rounded">
          <AlertCircle size={18} />
          <Text size="2">{error}</Text>
        </Flex>
      )}

      <Flex justify="between" className="mt-8">
        <Button size="3" variant="outline" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button 
          size="3" 
          onClick={handleSubmit} 
          disabled={!selected || loading || paymentProviders.length === 0}
        >
          {loading ? "Setting up..." : "Review Order"}
        </Button>
      </Flex>
    </div>
  )
}