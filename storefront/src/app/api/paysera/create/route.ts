import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import Medusa from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://backend:9000"

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, currency } = await request.json()
    
    if (!orderId || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Call our backend Paysera service
    const response = await fetch(`${MEDUSA_BACKEND_URL}/paysera/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        amount,
        currency,
        acceptUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/order/${orderId}/confirmation`,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout`,
        callbackUrl: `${MEDUSA_BACKEND_URL}/paysera/callback`
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create Paysera payment')
    }

    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating Paysera payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}