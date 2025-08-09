"use client"

import { useState } from "react"
import { Button, Text, Flex, Box, Heading, TextField } from "@radix-ui/themes"
import { Package, Truck, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface TrackingEvent {
  date: string
  time: string
  location?: string
  description: string
  status: string
}

interface TrackingInfo {
  tracking_number: string
  status: string
  status_description: string
  events: TrackingEvent[]
  estimated_delivery?: string
  delivery_date?: string
}

export default function VenipakTracker() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/shipping/venipak/track/${trackingNumber}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track package')
      }

      setTrackingInfo(data.tracking_info)
    } catch (err: any) {
      setError(err.message)
      setTrackingInfo(null)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="text-green-600" size={20} />
      case 'in_transit':
      case 'picked_up':
        return <Truck className="text-blue-600" size={20} />
      case 'out_for_delivery':
        return <MapPin className="text-orange-600" size={20} />
      default:
        return <Package className="text-gray-600" size={20} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'in_transit':
      case 'picked_up':
        return 'bg-blue-100 text-blue-800'
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-800'
      case 'failed_delivery':
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Heading size="6" className="mb-6 text-center">
        Track Your Venipak Package
      </Heading>

      <Box className="mb-6">
        <Flex gap="3">
          <TextField.Root className="flex-1">
            <TextField.Slot>
              <input
              placeholder="Enter tracking number (e.g. VP1234567890ABC)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
              />
            </TextField.Slot>
          </TextField.Root>
          <Button 
            onClick={handleTrack} 
            disabled={loading || !trackingNumber.trim()}
            size="3"
          >
            {loading ? "Tracking..." : "Track"}
          </Button>
        </Flex>
      </Box>

      {error && (
        <Flex align="center" gap="2" className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          <AlertCircle size={20} />
          <Text>{error}</Text>
        </Flex>
      )}

      {trackingInfo && (
        <div className="space-y-6">
          {/* Status Summary */}
          <Box className="p-6 bg-gray-50 rounded-lg">
            <Flex align="center" justify="between" className="mb-4">
              <div>
                <Heading size="4" className="mb-1">
                  Package Status
                </Heading>
                <Text color="gray" size="2">
                  Tracking: {trackingInfo.tracking_number}
                </Text>
              </div>
              {getStatusIcon(trackingInfo.status)}
            </Flex>
            
            <div className="mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingInfo.status)}`}>
                {trackingInfo.status_description}
              </span>
            </div>

            {trackingInfo.estimated_delivery && (
              <Flex align="center" gap="2" className="text-gray-600">
                <Clock size={16} />
                <Text size="2">
                  Estimated delivery: {new Date(trackingInfo.estimated_delivery).toLocaleDateString()}
                </Text>
              </Flex>
            )}

            {trackingInfo.delivery_date && (
              <Flex align="center" gap="2" className="text-green-600">
                <CheckCircle size={16} />
                <Text size="2">
                  Delivered on: {new Date(trackingInfo.delivery_date).toLocaleDateString()}
                </Text>
              </Flex>
            )}
          </Box>

          {/* Tracking Events */}
          <div>
            <Heading size="4" className="mb-4">
              Tracking History
            </Heading>
            <div className="space-y-4">
              {trackingInfo.events.map((event, index) => (
                <div key={index} className="flex gap-4 p-4 bg-white border rounded-lg">
                  <div className="flex-shrink-0">
                    {getStatusIcon(event.status)}
                  </div>
                  <div className="flex-1">
                    <Flex justify="between" align="start" className="mb-1">
                      <Text weight="medium">{event.description}</Text>
                      <Text size="2" color="gray">
                        {event.date} {event.time}
                      </Text>
                    </Flex>
                    {event.location && (
                      <Flex align="center" gap="1">
                        <MapPin size={14} className="text-gray-400" />
                        <Text size="2" color="gray">{event.location}</Text>
                      </Flex>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Help Information */}
          <Box className="p-4 bg-blue-50 rounded-lg">
            <Heading size="3" className="mb-2 text-blue-800">
              Need Help?
            </Heading>
            <Text size="2" color="gray" className="mb-3">
              If you have questions about your shipment, contact Venipak customer service.
            </Text>
            <Flex gap="4">
              <Text size="2">
                <strong>Phone:</strong> +370 5 233 3568
              </Text>
              <Text size="2">
                <strong>Email:</strong> info@venipak.com
              </Text>
            </Flex>
          </Box>
        </div>
      )}
    </div>
  )
}