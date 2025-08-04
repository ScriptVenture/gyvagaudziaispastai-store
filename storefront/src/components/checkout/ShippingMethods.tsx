"use client"

import { useState, useEffect } from "react"
import { Button, Text, Flex, Box, Heading, RadioGroup } from "@radix-ui/themes"
import { Truck, Package, Zap, AlertCircle } from "lucide-react"
import { HttpTypes } from "@medusajs/types"

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
  const [selected, setSelected] = useState(selectedMethod?.id || "")
  const [loading, setLoading] = useState(false)
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

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
        setError("Please select a shipping method")
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

      onUpdate({ shippingMethod: selectedOption })
      onNext()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getShippingIcon = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('express') || lowerName.includes('fast')) return Zap
    if (lowerName.includes('priority') || lowerName.includes('next')) return Truck
    return Package
  }

  if (loading) {
    return (
      <div>
        <Heading size="6" className="mb-6">Shipping Method</Heading>
        <Box className="p-8 text-center">
          <Text>Loading shipping options...</Text>
        </Box>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Heading size="6" className="mb-6">Shipping Method</Heading>
        <Flex align="center" gap="2" className="mb-4 p-3 bg-red-50 text-red-600 rounded">
          <AlertCircle size={18} />
          <Text size="2">{error}</Text>
        </Flex>
        <Flex justify="between">
          <Button size="3" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button size="3" onClick={fetchShippingOptions}>
            Retry
          </Button>
        </Flex>
      </div>
    )
  }

  return (
    <div>
      <Heading size="6" className="mb-6">Shipping Method</Heading>

      {shippingOptions.length === 0 ? (
        <Box className="p-4 bg-gray-50 rounded-lg mb-6">
          <Text color="gray">No shipping options available</Text>
        </Box>
      ) : (
        <RadioGroup.Root value={selected} onValueChange={setSelected}>
          <Flex direction="column" gap="3">
            {shippingOptions.map((option) => {
              const Icon = getShippingIcon(option.name)
              return (
                <label
                  key={option.id}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all
                    ${selected === option.id 
                      ? 'border-green-600 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <Flex align="start" gap="3">
                    <RadioGroup.Item value={option.id} />
                    <Box className="flex-1">
                      <Flex justify="between" align="start">
                        <Box>
                          <Flex align="center" gap="2" className="mb-1">
                            <Icon size={20} className="text-gray-600" />
                            <Text weight="medium">{option.name}</Text>
                          </Flex>
                          {option.data?.description && (
                            <Text size="2" color="gray">
                              {option.data.description}
                            </Text>
                          )}
                        </Box>
                        <Text weight="bold" size="3">
                          €{((option.amount || 0) / 100).toFixed(2)}
                        </Text>
                      </Flex>
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
          disabled={!selected || loading || shippingOptions.length === 0}
        >
          {loading ? "Setting..." : "Continue to Payment"}
        </Button>
      </Flex>
    </div>
  )
}