import { NextRequest, NextResponse } from 'next/server'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://backend:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tracking_number: string }> }
) {
  try {
    const { tracking_number } = await params
    const trackingNumber = tracking_number

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      )
    }

    console.log("Tracking Venipak package:", trackingNumber)

    // Call backend API to get tracking information
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/shipping/venipak/track/${trackingNumber}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to get tracking information' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error tracking Venipak package:', error)
    return NextResponse.json(
      { error: 'Failed to track package' },
      { status: 500 }
    )
  }
}