import { NextResponse } from 'next/server';
import { MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY } from '@/lib/config';

export async function GET() {
  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/products?fields=*,tags.*,images.*,variants.*`, {
      headers: {
        'Content-Type': 'application/json',
        ...(MEDUSA_PUBLISHABLE_KEY && {
          'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
        }),
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Debug information
    const debugInfo = {
      totalProducts: data.products?.length || 0,
      productsWithTags: data.products?.filter((p: any) => p.tags && p.tags.length > 0).length || 0,
      allTags: data.products?.flatMap((p: any) => p.tags?.map((t: any) => t.value) || []) || [],
      sampleProduct: data.products?.[0] || null,
      sampleProductWithTags: data.products?.find((p: any) => p.tags && p.tags.length > 0) || null,
    };

    return NextResponse.json({
      success: true,
      debug: debugInfo,
      rawProducts: data.products?.slice(0, 2) || [], // First 2 products for inspection
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
