"use client"

import { useState, useEffect } from "react"
import { Button, Text, Flex, Box, Heading, RadioGroup, Dialog } from "@radix-ui/themes"
import { Truck, Package, Zap, AlertCircle, MapPin } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import PickupPointSelector from "./PickupPointSelector"
import { useTranslation } from "@/hooks/useTranslation"
import { CART_API_URL } from "@/lib/config"

interface ShippingMethodsProps {
  cart: HttpTypes.StoreCart
  onNext: () => void
  onBack: () => void
  onUpdate: (data: any) => void
  selectedMethod: any
}

export default function ShippingMethods({ 
  cart, 
  onNext, 
  onBack, 
  onUpdate, 
  selectedMethod 
}: ShippingMethodsProps) {
  const { t } = useTranslation();
  
  const [selected, setSelected] = useState(selectedMethod?.id || "")
  const [loading, setLoading] = useState(false)
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showPickupSelector, setShowPickupSelector] = useState(false)
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<any>(null)
  const [currentPickupServiceType, setCurrentPickupServiceType] = useState<string>('')

  useEffect(() => {
    fetchShippingOptions()
  }, [])

  const fetchShippingOptions = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/shipping/options')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch shipping options')
      }

      setShippingOptions(data.shipping_options || [])
      
      // Debug: Log what we receive from the API
      if (data.shipping_options?.length > 0) {
        console.log("Frontend received shipping options:", data.shipping_options)
        console.log("First option price fields:", {
          amount: data.shipping_options[0].amount,
          price: data.shipping_options[0].price,
          calculated_price: data.shipping_options[0].calculated_price,
          cost: data.shipping_options[0].cost
        })
      }
      
      // Set first option as default if none selected
      if (data.shipping_options?.length > 0 && !selected) {
        setSelected(data.shipping_options[0].id)
      }
    } catch (err: any) {
      console.error('Error fetching shipping options:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      const selectedOption = shippingOptions.find(option => option.id === selected)
      if (!selectedOption) {
        setError(t('checkout.shipping.selectMethod'))
        return
      }
      
      // Check if this is a pickup/locker/post office option that requires pickup point selection
      const requiresPickupPoint = isPickupMethod(selectedOption)
      if (requiresPickupPoint && !selectedPickupPoint) {
        setError(t('checkout.shipping.pickupRequired'))
        return
      }

      // Set shipping method on the cart
      const response = await fetch('/api/shipping/method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ option_id: selected }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to set shipping method')
      }

      // Fetch updated cart to get calculated shipping cost
      const cartResponse = await fetch(`${CART_API_URL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const cartData = await cartResponse.json()
      
      if (cartResponse.ok && cartData.cart) {
        // Get the calculated shipping amount from the updated cart
        const shippingMethods = cartData.cart.shipping_methods
        const currentShippingMethod = shippingMethods?.[0]
        
        if (currentShippingMethod) {
          // Create updated shipping method with calculated price and pickup point info
          const updatedShippingMethod = {
            ...selectedOption,
            amount: currentShippingMethod.amount,
            calculated_amount: currentShippingMethod.amount,
            data: {
              ...selectedOption.data,
              amount: currentShippingMethod.amount,
              calculated_amount: currentShippingMethod.amount,
              pickup_point: selectedPickupPoint || undefined
            }
          }
          
          console.log('Updated shipping method with calculated price:', updatedShippingMethod)
          onUpdate({ shippingMethod: updatedShippingMethod })
        } else {
          onUpdate({ shippingMethod: selectedOption })
        }
      } else {
        onUpdate({ shippingMethod: selectedOption })
      }
      
      onNext()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getShippingIcon = (name: string, option?: any) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('pickup') || lowerName.includes('locker') || lowerName.includes('post')) return MapPin
    if (lowerName.includes('express') || lowerName.includes('fast')) return Zap
    if (lowerName.includes('priority') || lowerName.includes('next')) return Truck
    if (lowerName.includes('venipak')) return Truck
    return Package
  }

  const getShippingName = (option: any) => {
    // Translate Venipak service names to Lithuanian
    const name = option.name?.toLowerCase() || ''
    if (name.includes('venipak')) {
      if (name.includes('courier')) {
        return t('checkout.shipping.venipakCourier')
      }
      if (name.includes('express')) {
        return t('checkout.shipping.venipakExpress')
      }
      if (name.includes('pickup')) {
        return t('checkout.shipping.venipakPickupPoint')
      }
      if (name.includes('locker')) {
        return t('checkout.shipping.venipakLocker')
      }
      if (name.includes('post')) {
        return t('checkout.shipping.venipakPostOffice')
      }
    }
    
    // Return original name if no translation found
    return option.name || 'Unknown Shipping Method'
  }

  const getShippingDescription = (option: any) => {
    // First check if we have a description in the option data
    if (option.data?.description) {
      return option.data.description
    }
    
    // Map Venipak service names to Lithuanian descriptions
    const name = option.name?.toLowerCase() || ''
    if (name.includes('venipak')) {
      if (name.includes('courier')) {
        return t('checkout.shipping.courierDelivery')
      }
      if (name.includes('express')) {
        return t('checkout.shipping.expressDelivery')
      }
      if (name.includes('pickup')) {
        return t('checkout.shipping.pickupPointDelivery')
      }
      if (name.includes('locker')) {
        return t('checkout.shipping.lockerDelivery')
      }
      if (name.includes('post')) {
        return t('checkout.shipping.postOfficeDelivery')
      }
    }
    
    // Generic fallback with delivery time if available
    if (option.data?.delivery_time) {
      return `${t('checkout.shipping.delivery')}: ${option.data.delivery_time}`
    }
    
    return t('checkout.shipping.standardShipping')
  }
  
  const isPickupMethod = (option: any) => {
    const name = option.name?.toLowerCase() || ''
    return name.includes('pickup') || name.includes('locker') || name.includes('post')
  }
  
  const getPickupServiceType = (option: any) => {
    const name = option.name?.toLowerCase() || ''
    if (name.includes('locker')) return 'locker'
    if (name.includes('post')) return 'post_office'
    if (name.includes('pickup')) return 'pickup_point'
    return 'all'
  }
  
  const handlePickupPointSelection = (option: any) => {
    setCurrentPickupServiceType(getPickupServiceType(option))
    setShowPickupSelector(true)
  }
  
  const handlePickupPointSelect = (pickupPoint: any) => {
    setSelectedPickupPoint(pickupPoint)
    setShowPickupSelector(false)
  }

  if (loading) {
    return (
      <div>
        <Heading size="6" className="mb-6">{t('checkout.shipping.title')}</Heading>
        <Box className="p-8 text-center">
          <Text>{t('loading')}</Text>
        </Box>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Heading size="6" className="mb-6">{t('checkout.shipping.title')}</Heading>
        <Flex align="center" gap="2" className="mb-4 p-3 bg-red-50 text-red-600 rounded">
          <AlertCircle size={18} />
          <Text size="2">{error}</Text>
        </Flex>
        <Flex justify="between">
          <Button size="3" variant="outline" onClick={onBack}>
            {t('back')}
          </Button>
          <Button size="3" onClick={fetchShippingOptions}>
            {t('checkout.shipping.retry')}
          </Button>
        </Flex>
      </div>
    )
  }

  return (
    <div>
      <Heading size="6" className="mb-6">{t('checkout.shipping.title')}</Heading>

      {shippingOptions.length === 0 ? (
        <Box className="p-4 bg-gray-50 rounded-lg mb-6">
          <Text color="gray">{t('checkout.shipping.noMethods')}</Text>
        </Box>
      ) : (
        <RadioGroup.Root value={selected} onValueChange={setSelected}>
          <Flex direction="column" gap="3">
            {shippingOptions.map((option) => {
              const Icon = getShippingIcon(option.name)
              return (
                <div key={option.id}>
                  <label
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all block
                      ${selected === option.id 
                        ? 'border-green-600 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <Flex align="start" gap="3">
                      <RadioGroup.Item 
                        value={option.id} 
                        onClick={() => setSelected(option.id)}
                      />
                      <Box className="flex-1">
                        <Flex justify="between" align="start">
                          <Box>
                            <Flex align="center" gap="2" className="mb-1">
                              <Icon size={20} className="text-gray-600" />
                              <Text weight="medium">{getShippingName(option)}</Text>
                            </Flex>
                            <Text size="2" color="gray">
                              {getShippingDescription(option)}
                            </Text>
                          </Box>
                          <Text weight="bold" size="3">
                            €{(() => {
                              // Handle different price field formats from Medusa API
                              // For calculated prices, the amount is in option.data.amount
                              const price = option.data?.amount || option.amount || option.calculated_price?.calculated_amount || option.price?.amount || option.price || 0
                              const numPrice = Number(price)
                              if (isNaN(numPrice)) return '0.00'
                              return (numPrice / 100).toFixed(2)
                            })()}
                          </Text>
                        </Flex>
                      </Box>
                    </Flex>
                  </label>
                  
                  {/* Pickup Point Selection for pickup/locker/post options */}
                  {selected === option.id && isPickupMethod(option) && (
                    <Box className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <Flex align="center" justify="between" className="mb-3">
                        <Text weight="medium" size="2">{t('checkout.shipping.pickupLocationRequired')}</Text>
                        <Button 
                          size="2" 
                          variant="outline"
                          onClick={() => handlePickupPointSelection(option)}
                        >
                          <MapPin size={14} />
                          {selectedPickupPoint ? t('checkout.shipping.changeLocation') : t('checkout.shipping.selectLocation')}
                        </Button>
                      </Flex>
                      
                      {selectedPickupPoint && (
                        <Box className="p-3 bg-white border rounded">
                          <Text weight="medium" size="2" className="block">
                            {selectedPickupPoint.name}
                          </Text>
                          <Text size="1" color="gray">
                            {selectedPickupPoint.address}, {selectedPickupPoint.city}
                          </Text>
                        </Box>
                      )}
                      
                      {!selectedPickupPoint && (
                        <Text size="2" color="red">
                          {t('checkout.shipping.pleaseSelectPickupLocation')}
                        </Text>
                      )}
                    </Box>
                  )}
                </div>
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
          disabled={!selected || loading || shippingOptions.length === 0}
        >
          {loading ? t('checkout.shipping.setting') : t('continueToPayment')}
        </Button>
      </Flex>
      
      {/* Pickup Point Selection Dialog */}
      <Dialog.Root open={showPickupSelector} onOpenChange={setShowPickupSelector}>
        <Dialog.Content maxWidth="600px">
          <Dialog.Title>{t('checkout.shipping.selectPickupLocationDialog')}</Dialog.Title>
          <Dialog.Description size="2" className="mb-4">
            {t('checkout.shipping.chooseConvenientLocation')}
          </Dialog.Description>
          
          <PickupPointSelector
            shippingAddress={cart?.shipping_address}
            onSelect={handlePickupPointSelect}
            selectedPoint={selectedPickupPoint}
            serviceType={currentPickupServiceType as any}
          />
          
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                {t('checkout.shipping.cancel')}
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}