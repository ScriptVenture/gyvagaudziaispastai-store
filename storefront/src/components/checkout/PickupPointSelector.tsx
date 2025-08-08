"use client"

import { useState, useEffect } from "react"
import { Button, Text, Flex, Box, Heading, TextField, Select, Badge } from "@radix-ui/themes"
import { MapPin, Clock, Package2, Mail, Building2, AlertCircle, Search } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

interface PickupPoint {
  id: string
  name: string
  address: string
  city: string
  country: string
  zip: string
  code: string
  coordinates?: {
    lat: number
    lng: number
  }
  type: 'pickup_point' | 'locker' | 'post_office'
  working_hours?: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
  }
  max_weight?: number
  max_dimensions?: {
    length: number
    width: number
    height: number
  }
  available: boolean
  services?: string[]
  payment_methods?: string[]
}

interface PickupPointSelectorProps {
  shippingAddress: any
  onSelect: (pickupPoint: PickupPoint) => void
  selectedPoint?: PickupPoint | null
  serviceType: 'pickup_point' | 'locker' | 'post_office' | 'all'
}

export default function PickupPointSelector({ 
  shippingAddress, 
  onSelect, 
  selectedPoint,
  serviceType = 'all'
}: PickupPointSelectorProps) {
  const { t } = useTranslation();
  
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchCity, setSearchCity] = useState('')
  const [filterType, setFilterType] = useState<string>(serviceType)
  
  useEffect(() => {
    if (shippingAddress?.city) {
      setSearchCity(shippingAddress.city)
    }
  }, [shippingAddress])
  
  useEffect(() => {
    fetchPickupPoints()
  }, [shippingAddress, filterType])

  const fetchPickupPoints = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        country: shippingAddress?.country_code?.toUpperCase() || 'LT',
        type: filterType,
        limit: '20'
      })
      
      if (searchCity) {
        params.set('city', searchCity)
      }
      if (shippingAddress?.postal_code) {
        params.set('postal_code', shippingAddress.postal_code)
      }
      
      console.log("Fetching pickup points with params:", params.toString())
      
      const response = await fetch(`/api/venipak/pickup-points?${params}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || t('pickupPoints.loadingPoints'))
      }
      
      console.log("Received pickup points:", data.pickup_points?.length || 0)
      setPickupPoints(data.pickup_points || [])
      
    } catch (err: any) {
      console.error('Error fetching pickup points:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchPickupPoints()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'locker': return Package2
      case 'post_office': return Mail
      case 'pickup_point':
      default: return Building2
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'locker': return { color: 'blue' as const, text: t('pickupPoints.types.locker') }
      case 'post_office': return { color: 'green' as const, text: t('pickupPoints.types.post_office') }
      case 'pickup_point':
      default: return { color: 'gray' as const, text: t('pickupPoints.types.pickup_point') }
    }
  }

  const formatWorkingHours = (hours?: any) => {
    if (!hours) return t('pickupPoints.workingHours')
    
    // If it's 24/7
    if (hours.monday === '24/7') return t('pickupPoints.available247')
    
    // Try to find common pattern
    const weekdays = `${hours.monday || t('pickupPoints.closed')}`
    const saturday = hours.saturday || t('pickupPoints.closed')
    const sunday = hours.sunday || t('pickupPoints.closed')
    
    if (weekdays === saturday && weekdays === sunday) {
      return weekdays
    }
    
    return `${t('pickupPoints.mon')}-${t('pickupPoints.fri')}: ${weekdays}, ${t('pickupPoints.sat')}: ${saturday}, ${t('pickupPoints.sun')}: ${sunday}`
  }

  if (loading) {
    return (
      <Box className="p-6">
        <Flex align="center" justify="center" className="py-8">
          <Text>{t('pickupPoints.loadingPoints')}</Text>
        </Flex>
      </Box>
    )
  }

  return (
    <Box className="space-y-4">
      <Heading size="4" className="mb-4">{t('pickupPoints.title')}</Heading>
      
      {/* Search and Filter Controls */}
      <Flex gap="3" align="end" wrap="wrap">
        <Box className="flex-1">
          <Text size="2" weight="medium" className="mb-1">{t('pickupPoints.searchCity')}</Text>
          <TextField.Root
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder={t('pickupPoints.searchCity')}
          />
        </Box>
        
        <Box>
          <Text size="2" weight="medium" className="mb-1">{t('pickupPoints.filterType')}</Text>
          <Select.Root value={filterType} onValueChange={setFilterType}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="all">{t('pickupPoints.allTypes')}</Select.Item>
              <Select.Item value="pickup_point">{t('pickupPoints.pickupPoint')}</Select.Item>
              <Select.Item value="locker">{t('pickupPoints.locker')}</Select.Item>
              <Select.Item value="post_office">{t('pickupPoints.postOffice')}</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>
        
        <Button onClick={handleSearch} disabled={loading}>
          <Search size={16} />
          {t('search')}
        </Button>
      </Flex>

      {error && (
        <Flex align="center" gap="2" className="p-3 bg-red-50 text-red-600 rounded">
          <AlertCircle size={18} />
          <Text size="2">{error}</Text>
        </Flex>
      )}

      {/* Pickup Points List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {pickupPoints.length === 0 ? (
          <Box className="p-4 bg-gray-50 rounded-lg text-center">
            <Text color="gray">{t('pickupPoints.noResults')}</Text>
          </Box>
        ) : (
          pickupPoints.map((point) => {
            const Icon = getTypeIcon(point.type)
            const badge = getTypeBadge(point.type)
            const isSelected = selectedPoint?.id === point.id

            return (
              <Box
                key={point.id}
                className={`
                  border rounded-lg p-4 cursor-pointer transition-all
                  ${isSelected 
                    ? 'border-green-600 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => onSelect(point)}
              >
                <Flex gap="3">
                  <Icon size={20} className="text-gray-600 mt-1 flex-shrink-0" />
                  
                  <Box className="flex-1 min-w-0">
                    <Flex justify="between" align="start" className="mb-2">
                      <Box className="min-w-0 flex-1">
                        <Text weight="medium" className="block truncate">
                          {point.name}
                        </Text>
                        <Badge color={badge.color} size="1" className="mt-1">
                          {badge.text}
                        </Badge>
                      </Box>
                    </Flex>
                    
                    <Flex align="start" gap="2" className="mb-2">
                      <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <Text size="2" color="gray" className="leading-tight">
                        {point.address}, {point.city} {point.zip}
                      </Text>
                    </Flex>
                    
                    <Flex align="start" gap="2" className="mb-2">
                      <Clock size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <Text size="2" color="gray" className="leading-tight">
                        {formatWorkingHours(point.working_hours)}
                      </Text>
                    </Flex>
                    
                    {point.services && point.services.length > 0 && (
                      <Flex wrap="wrap" gap="1" className="mt-2">
                        {point.services.slice(0, 3).map((service, index) => (
                          <Badge key={index} color="blue" size="1" variant="soft">
                            {service}
                          </Badge>
                        ))}
                      </Flex>
                    )}
                    
                    <Flex align="center" justify="between" className="mt-3">
                      <Text size="1" color="gray">
                        Code: {point.code}
                      </Text>
                      
                      {isSelected && (
                        <Badge color="green" size="2">
                          {t('selected')}
                        </Badge>
                      )}
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            )
          })
        )}
      </div>

      {selectedPoint && (
        <Box className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <Text weight="medium" color="green">
            {t('selected')}: {selectedPoint.name}
          </Text>
          <Text size="2" color="green" className="block mt-1">
            {selectedPoint.address}, {selectedPoint.city}
          </Text>
        </Box>
      )}
    </Box>
  )
}