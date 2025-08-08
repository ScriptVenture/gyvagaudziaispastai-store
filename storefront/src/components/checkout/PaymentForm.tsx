"use client"

import { useState, useEffect } from "react"
import { Button, Text, Flex, Box, Heading, RadioGroup } from "@radix-ui/themes"
import { CreditCard, Banknote, Wallet, AlertCircle } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "@/hooks/useTranslation"

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
  const { t } = useTranslation()
  const [selected, setSelected] = useState("")
  const [loading, setLoading] = useState(false)
  const [paymentProviders, setPaymentProviders] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get payment providers from cart region
    const providers = cart?.region?.payment_providers || []
    console.log('Available payment providers:', providers)
    
    setPaymentProviders(providers)
    if (providers.length > 0 && !selected) {
      setSelected(providers[0].id)
    }
  }, [cart, selected])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      const provider = paymentProviders.find(p => p.id === selected)
      if (!provider) {
        setError(t('checkout.payment.pleaseSelectPayment'))
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

      console.log('Payment session initialized successfully')
      
      onUpdate({ 
        paymentProvider: provider,
        paymentMethod: {
          id: provider.id,
          name: getProviderName(provider.id),
          description: getProviderDescription(provider.id)
        }
      })
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
        return t('checkout.payment.creditCardPayment')
      case "pp_paysera_paysera":
        return t('checkout.payment.payseraPayment')
      case "paysera":
        return t('checkout.payment.payseraPayment')
      case "pp_system_default":
        return t('checkout.payment.manualPayment')
      case "pp_manual_manual":
        return t('checkout.payment.manualPayment')
      default:
        return (providerId?.replace("pp_", "")?.replace("_", " ") || providerId)?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }
  }

  const getProviderDescription = (providerId: string) => {
    switch (providerId) {
      case "pp_stripe_stripe":
        return t('checkout.payment.creditCardDescription')
      case "pp_paysera_paysera":
        return t('checkout.payment.payseraDescription')
      case "paysera":
        return t('checkout.payment.payseraDescription')
      case "pp_system_default":
        return t('checkout.payment.manualPaymentDescription')
      case "pp_manual_manual":
        return t('checkout.payment.manualPaymentFull')
      default:
        return t('checkout.payment.securePayment')
    }
  }

  if (loading) {
    return (
      <div>
        <Heading size="6" className="mb-6">{t('checkout.payment.title')}</Heading>
        <Box className="p-8 text-center">
          <Text>{t('checkout.payment.loadingPaymentOptions')}</Text>
        </Box>
      </div>
    )
  }

  return (
    <div>
      <Heading size="6" className="mb-6">{t('checkout.payment.title')}</Heading>

      {paymentProviders.length === 0 ? (
        <Box className="p-4 bg-gray-50 rounded-lg mb-6">
          <Text color="gray">{t('checkout.payment.noPaymentProviders')}</Text>
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
          {t('back')}
        </Button>
        <Button 
          size="3" 
          onClick={handleSubmit} 
          disabled={!selected || loading || paymentProviders.length === 0}
        >
          {loading ? t('checkout.payment.settingUp') : t('checkout.payment.reviewOrder')}
        </Button>
      </Flex>
    </div>
  )
}