"use client"

import { useState, useEffect } from "react";
import { brandColors } from "@/utils/colors";
import { STORE_API_URL, MEDUSA_PUBLISHABLE_KEY } from "@/lib/config";
import ProductCard from "@/components/product/ProductCard";

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  thumbnail: string | null;
  images?: Array<{
    id: string;
    url: string;
    rank: number;
  }>;
  variants: Array<{
    id: string;
    title: string;
    prices?: Array<{
      amount: number;
      currency_code: string;
    }>;
    calculated_price?: {
      calculated_amount: number;
      currency_code: string;
    };
  }>;
}

async function fetchProducts() {
  try {
    if (typeof window !== 'undefined') {
      console.log('Fetching products from API...');
      console.log('STORE_API_URL:', STORE_API_URL);
      console.log('MEDUSA_PUBLISHABLE_KEY:', MEDUSA_PUBLISHABLE_KEY ? 'Present' : 'Missing');
      console.log('Full URL:', `${STORE_API_URL}/products`);
    }
    const response = await fetch(`${STORE_API_URL}/products?fields=*,images.*,tags.*`, {
      cache: 'no-store', // Ensure fresh data
      headers: {
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
        'Content-Type': 'application/json',
      },
    });
    
    if (typeof window !== 'undefined') {
      console.log('API Response status:', response.status);
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      if (typeof window !== 'undefined') {
        console.error('API Error:', errorData);
      }
      throw new Error(`Failed to fetch: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }
    
    const data = await response.json();
    if (typeof window !== 'undefined') {
      console.log('Fetched products:', data.products?.length || 0, 'items');
    }
    return data.products || [];
  } catch (error) {
    if (typeof window !== 'undefined') {
      console.error('Error fetching products:', error);
    }
    return [];
  }
}

export default function BestsellingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const fetchedProducts = await fetchProducts();
      // Take first 4 products as bestsellers for now
      setProducts(fetchedProducts.slice(0, 4));
      setLoading(false);
    }
    loadProducts();
  }, []);


  if (loading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="bg-gray-200 h-80 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white border-b border-gray-100">
      <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6">
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          
          {/* Urgency Header */}
          <div className="text-center w-full">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Ribotas kiekis - Nemokamas pristatymas nuo €75
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 mobile-text-wrap" style={{ color: brandColors.primary }}>
              Populiariausi gyvūnų spąstai
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-1 sm:px-2 mobile-text-wrap">
              Profesionalūs spąstai, kuriais pasitiki 15,000+ klientų visame pasaulyje. Užsakykite dabar ir gaukite per 1 dieną.
            </p>
          </div>

          {/* Dynamic Product Cards */}
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  variant="default"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
