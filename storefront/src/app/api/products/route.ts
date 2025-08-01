import { NextResponse } from 'next/server';

// Use the internal Docker network URL
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://backend:9000';
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

export async function GET() {
  try {
    // Get products with variants and prices using fields parameter
    const apiUrl = `${MEDUSA_BACKEND_URL}/store/products?fields=*variants,*variants.prices`;
    
    console.log('Fetching from:', apiUrl);
    console.log('Using API key:', MEDUSA_PUBLISHABLE_KEY ? 'Key present' : 'No key');

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      cache: 'no-store',
      // Add timeout and retry options
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}, body:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully fetched products:', data.products?.length || 0, 'products');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}