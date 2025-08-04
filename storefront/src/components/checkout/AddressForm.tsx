"use client"

import { useState } from "react"
import { Button, TextField, Select, Checkbox, Text, Flex, Box, Heading } from "@radix-ui/themes"
import { Mail, User, MapPin, Building, Phone } from "lucide-react"

interface AddressFormProps {
  onNext: () => void
  onUpdate: (data: any) => void
  initialData: any
}

export default function AddressForm({ onNext, onUpdate, initialData }: AddressFormProps) {
  const [formData, setFormData] = useState({
    email: initialData.email || "",
    shippingAddress: {
      firstName: initialData.shippingAddress?.firstName || "",
      lastName: initialData.shippingAddress?.lastName || "",
      company: initialData.shippingAddress?.company || "",
      address1: initialData.shippingAddress?.address1 || "",
      address2: initialData.shippingAddress?.address2 || "",
      city: initialData.shippingAddress?.city || "",
      postalCode: initialData.shippingAddress?.postalCode || "",
      countryCode: initialData.shippingAddress?.countryCode || "LT",
      phone: initialData.shippingAddress?.phone || "",
    },
    sameAsBilling: true,
  })

  const [errors, setErrors] = useState<any>({})

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.shippingAddress.firstName) newErrors.firstName = "First name is required"
    if (!formData.shippingAddress.lastName) newErrors.lastName = "Last name is required"
    if (!formData.shippingAddress.address1) newErrors.address1 = "Address is required"
    if (!formData.shippingAddress.city) newErrors.city = "City is required"
    if (!formData.shippingAddress.postalCode) newErrors.postalCode = "Postal code is required"
    if (!formData.shippingAddress.phone) newErrors.phone = "Phone is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      // Update cart with addresses via API
      const response = await fetch('/api/cart/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          shipping_address: formData.shippingAddress,
          billing_address: formData.sameAsBilling ? formData.shippingAddress : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update addresses')
      }

      onUpdate({
        email: formData.email,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.sameAsBilling ? formData.shippingAddress : null,
      })
      onNext()
    } catch (error: any) {
      console.error('Error updating addresses:', error)
      setErrors({ general: error.message })
    }
  }

  const updateField = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Heading size="6" className="mb-6">Shipping Information</Heading>

      {/* Email */}
      <Box className="mb-6">
        <Text size="2" weight="medium" className="block mb-2">
          Contact Information
        </Text>
        <TextField.Root
          placeholder="Email address"
          type="email"
          size="3"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
        >
          <TextField.Slot>
            <Mail size={18} />
          </TextField.Slot>
        </TextField.Root>
        {errors.email && <Text size="1" color="red">{errors.email}</Text>}
      </Box>

      {/* Shipping Address */}
      <Text size="2" weight="medium" className="block mb-4">
        Shipping Address
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Box>
          <TextField.Root
            placeholder="First name"
            size="3"
            value={formData.shippingAddress.firstName}
            onChange={(e) => updateField('shippingAddress.firstName', e.target.value)}
          >
            <TextField.Slot>
              <User size={18} />
            </TextField.Slot>
          </TextField.Root>
          {errors.firstName && <Text size="1" color="red">{errors.firstName}</Text>}
        </Box>

        <Box>
          <TextField.Root
            placeholder="Last name"
            size="3"
            value={formData.shippingAddress.lastName}
            onChange={(e) => updateField('shippingAddress.lastName', e.target.value)}
          />
          {errors.lastName && <Text size="1" color="red">{errors.lastName}</Text>}
        </Box>
      </div>

      <Box className="mb-4">
        <TextField.Root
          placeholder="Company (optional)"
          size="3"
          value={formData.shippingAddress.company}
          onChange={(e) => updateField('shippingAddress.company', e.target.value)}
        >
          <TextField.Slot>
            <Building size={18} />
          </TextField.Slot>
        </TextField.Root>
      </Box>

      <Box className="mb-4">
        <TextField.Root
          placeholder="Address"
          size="3"
          value={formData.shippingAddress.address1}
          onChange={(e) => updateField('shippingAddress.address1', e.target.value)}
        >
          <TextField.Slot>
            <MapPin size={18} />
          </TextField.Slot>
        </TextField.Root>
        {errors.address1 && <Text size="1" color="red">{errors.address1}</Text>}
      </Box>

      <Box className="mb-4">
        <TextField.Root
          placeholder="Apartment, suite, etc. (optional)"
          size="3"
          value={formData.shippingAddress.address2}
          onChange={(e) => updateField('shippingAddress.address2', e.target.value)}
        />
      </Box>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Box className="md:col-span-1">
          <TextField.Root
            placeholder="City"
            size="3"
            value={formData.shippingAddress.city}
            onChange={(e) => updateField('shippingAddress.city', e.target.value)}
          />
          {errors.city && <Text size="1" color="red">{errors.city}</Text>}
        </Box>

        <Box>
          <Select.Root
            value={formData.shippingAddress.countryCode}
            onValueChange={(value) => updateField('shippingAddress.countryCode', value)}
          >
            <Select.Trigger placeholder="Country" />
            <Select.Content>
              <Select.Item value="LT">Lithuania</Select.Item>
              <Select.Item value="LV">Latvia</Select.Item>
              <Select.Item value="EE">Estonia</Select.Item>
              <Select.Item value="PL">Poland</Select.Item>
              <Select.Item value="DE">Germany</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>

        <Box>
          <TextField.Root
            placeholder="Postal code"
            size="3"
            value={formData.shippingAddress.postalCode}
            onChange={(e) => updateField('shippingAddress.postalCode', e.target.value)}
          />
          {errors.postalCode && <Text size="1" color="red">{errors.postalCode}</Text>}
        </Box>
      </div>

      <Box className="mb-6">
        <TextField.Root
          placeholder="Phone number"
          size="3"
          type="tel"
          value={formData.shippingAddress.phone}
          onChange={(e) => updateField('shippingAddress.phone', e.target.value)}
        >
          <TextField.Slot>
            <Phone size={18} />
          </TextField.Slot>
        </TextField.Root>
        {errors.phone && <Text size="1" color="red">{errors.phone}</Text>}
      </Box>

      {/* Same as billing */}
      <Flex align="center" gap="2" className="mb-6">
        <Checkbox
          checked={formData.sameAsBilling}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sameAsBilling: checked as boolean }))}
        />
        <Text size="2">Billing address same as shipping</Text>
      </Flex>

      {/* Error Message */}
      {errors.general && (
        <Text size="2" color="red" className="mb-4">
          {errors.general}
        </Text>
      )}

      {/* Submit Button */}
      <Flex justify="end">
        <Button size="3" type="submit">
          Continue to Shipping
        </Button>
      </Flex>
    </form>
  )
}