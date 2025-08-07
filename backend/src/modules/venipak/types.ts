export interface VenipakConfig {
  api_key: string
  api_secret?: string
  username: string
  password: string
  test_mode?: boolean
  base_url?: string
  default_currency?: string
}

export interface VenipakShippingOption {
  id: string
  name: string
  amount: number
  currency: string
  data?: {
    service_type: string
    delivery_time: string
    description?: string
    max_weight?: number
    max_dimensions?: {
      length: number
      width: number
      height: number
    }
  }
}

export interface VenipakRateRequest {
  sender: {
    country: string
    city: string
    postal_code: string
  }
  recipient: {
    country: string
    city: string
    postal_code: string
  }
  package: {
    weight: number // in kg
    length: number // in cm
    width: number // in cm
    height: number // in cm
    value?: number // package value for insurance
  }
  service_type?: string
}

export interface VenipakRateResponse {
  success: boolean
  rates?: VenipakShippingOption[]
  error?: string
}

export interface VenipakShipmentRequest {
  sender: {
    name: string
    company?: string
    address: string
    city: string
    postal_code: string
    country: string
    phone?: string
    email?: string
  }
  recipient: {
    name: string
    company?: string
    address: string
    city: string
    postal_code: string
    country: string
    phone?: string
    email?: string
  }
  package: {
    weight: number
    length?: number
    width?: number
    height?: number
    description: string
    value?: number
  }
  service_type: string
  reference?: string
  delivery_instructions?: string
}

export interface VenipakShipmentResponse {
  success: boolean
  tracking_number?: string
  label_url?: string
  shipment_id?: string
  estimated_delivery?: string
  error?: string
}

export interface VenipakTrackingInfo {
  tracking_number: string
  status: string
  status_description: string
  events: Array<{
    date: string
    time: string
    location?: string
    description: string
    status: string
  }>
  estimated_delivery?: string
  delivery_date?: string
}

export interface VenipakWebhookData {
  tracking_number: string
  status: string
  event_type: string
  timestamp: string
  location?: string
  description?: string
}

// Common Venipak service types
export enum VenipakServiceType {
  STANDARD = 'standard',
  EXPRESS = 'express',
  PICKUP_POINT = 'pickup_point',
  LOCKER = 'locker',
  SAME_DAY = 'same_day'
}

// Venipak delivery statuses
export enum VenipakDeliveryStatus {
  CREATED = 'created',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED_DELIVERY = 'failed_delivery',
  RETURNED = 'returned',
  CANCELLED = 'cancelled'
}