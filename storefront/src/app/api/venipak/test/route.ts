import { NextResponse } from 'next/server'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://backend:9000"

export async function GET() {
  try {
    console.log("Testing Venipak API through backend...")
    
    // Call a test endpoint we need to create in Medusa
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/venipak/test`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      data: data
    })
  } catch (error: any) {
    console.error('Error testing Venipak API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to test Venipak API',
        details: error.message 
      },
      { status: 500 }
    )
  }
}