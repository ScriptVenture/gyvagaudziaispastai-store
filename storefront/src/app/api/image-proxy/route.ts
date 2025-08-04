import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  
  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  try {
    // Convert relative URL to backend URL
    let imageUrl = url
    
    if (!url.startsWith('http')) {
      imageUrl = `http://backend:9000${url}`
    } else if (url.includes('localhost:9000')) {
      // Replace localhost with backend for Docker environment
      imageUrl = url.replace('http://backend:9000', 'http://backend:9000')
    }
    
    const response = await fetch(imageUrl)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }
    
    const blob = await response.blob()
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    return new NextResponse('Error fetching image', { status: 500 })
  }
}