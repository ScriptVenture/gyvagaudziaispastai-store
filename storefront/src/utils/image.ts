// Utility to handle image URLs in different environments
export function getImageUrl(imageUrl: string | undefined): string {
  if (!imageUrl) return ''
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // If running in Docker and the URL points to localhost, replace with backend hostname
    if (typeof window === 'undefined' && imageUrl.includes('localhost:9000')) {
      return imageUrl.replace('localhost:9000', 'backend:9000')
    }
    return imageUrl
  }
  
  // If it's a relative path, prepend the backend URL
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://backend:9000'
  return `${backendUrl}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`
}

// For server-side image optimization - proxy through our API route
export function getOptimizedImageUrl(imageUrl: string | undefined): string {
  if (!imageUrl) return ''
  
  // If it's already a full URL pointing to our domain, return as is
  if (imageUrl.startsWith('https://gyva.appiolabs.com/') && !imageUrl.includes('/static/')) {
    return imageUrl
  }
  
  // Convert Medusa backend URLs to use our proxy API route
  if (imageUrl.includes('/static/')) {
    // Extract the filename from the URL
    const staticPathMatch = imageUrl.match(/\/static\/(.+)$/)
    if (staticPathMatch) {
      return `/api/images/${staticPathMatch[1]}`
    }
  }
  
  // Convert localhost URLs to our proxy API route
  if (imageUrl.includes('localhost:9000/static/')) {
    const filename = imageUrl.split('/static/')[1]
    return `/api/images/${filename}`
  }
  
  // For other URLs, try to use them directly but handle environment differences
  return getImageUrl(imageUrl)
}