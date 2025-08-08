import { NextRequest, NextResponse } from 'next/server'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://backend:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching Venipak pickup points through storefront API...")
    
    // Get query parameters from the request
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country') || 'LT'
    const city = searchParams.get('city') || ''
    const postal_code = searchParams.get('postal_code') || ''
    const type = searchParams.get('type') || 'all'
    const limit = searchParams.get('limit') || '50'
    
    console.log("Pickup points request params:", {
      country, city, postal_code, type, limit
    })

    // Build query string for backend API
    const queryParams = new URLSearchParams({
      country,
      type,
      limit
    })
    
    if (city) queryParams.set('city', city)
    if (postal_code) queryParams.set('postal_code', postal_code)
    
    // Call backend API with publishable key
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/venipak/pickup-points?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
    })
    
    const data = await response.json()
    
    console.log("Backend pickup points response:", {
      success: data.success,
      pickup_points_count: data.pickup_points?.length || 0,
      error: data.error
    })
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch pickup points')
    }
    
    return NextResponse.json({
      success: data.success,
      pickup_points: data.pickup_points || [],
      total_count: data.total_count || 0,
      filters: data.filters
    })
  } catch (error: any) {
    console.error('Error fetching Venipak pickup points:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch pickup points',
        details: error.message 
      },
      { status: 500 }
    )
  }
}