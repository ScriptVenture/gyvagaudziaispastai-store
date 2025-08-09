import { NextRequest, NextResponse } from 'next/server'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://backend:9000"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const imagePath = path.join('/')
    const imageUrl = `${MEDUSA_BACKEND_URL}/static/${imagePath}`
    
    console.log('Proxying image request:', imageUrl)
    
    const response = await fetch(imageUrl)
    
    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText)
      return new NextResponse('Image not found', { status: 404 })
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}