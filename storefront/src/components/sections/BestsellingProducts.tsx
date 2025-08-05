"use client"

import { useState, useEffect } from "react";
import { Star, Shield } from "lucide-react";
import { brandColors } from "@/utils/colors";

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  thumbnail: string | null;
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
    }
    const response = await fetch('/api/products', {
      cache: 'no-store', // Ensure fresh data
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
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">🏆 Populiariausi spąstai</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8">
              {products.map((product, index) => {
                const mainVariant = product.variants?.[0];
                
                // Try multiple approaches to get the price
                let price = 0;
                
                // 1. Try calculated_price first (most accurate)
                if (mainVariant?.calculated_price?.calculated_amount) {
                  price = mainVariant.calculated_price.calculated_amount;
                } 
                // 2. Try regular prices array
                else if (mainVariant?.prices && mainVariant.prices.length > 0) {
                  const eurPrice = mainVariant.prices.find(p => 
                    p.currency_code === 'eur' || p.currency_code === 'EUR'
                  );
                  price = eurPrice?.amount || mainVariant.prices[0]?.amount || 0;
                }
                
                // Handle price formatting (prices can be in cents or whole numbers)
                const formattedPrice = price > 1000 ? `€${(price / 100).toFixed(2)}` : `€${price.toFixed(2)}`;
                
                // Simulate some dynamic data based on product
                const mockStock = index < 2 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 20) + 10;
                const mockRating = 4.6 + Math.random() * 0.4;
                const mockReviews = Math.floor(Math.random() * 200) + 50;
                
                return (
                  <div key={product.id} className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200">
                    
                    {/* Stock Urgency Badge */}
                    {mockStock <= 5 && (
                      <div className="absolute top-2 left-2 z-20">
                        <div className="bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                          Tik {mockStock} liko
                        </div>
                      </div>
                    )}
                    
                    {/* Bestseller Badge */}
                    <div className="absolute top-2 right-2 z-20">
                      <div className="bg-orange-500 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                        POPULIARIAUSIAS
                      </div>
                    </div>
                    
                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-gray-50">
                      <img 
                        src={product.thumbnail || "/imagen5.jpg"} 
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-102 transition-transform duration-200"
                      />
                    </div>
                    
                    {/* Product Content */}
                    <div className="p-3">
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(mockRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 ml-1">({mockReviews})</span>
                      </div>
                      
                      {/* Product Title */}
                      <h3 className="text-sm font-medium leading-tight mb-2 line-clamp-2" style={{ color: brandColors.textPrimary }}>
                        {product.title}
                      </h3>
                      
                      {/* Key Feature */}
                      <div className="text-xs text-gray-600 mb-2">
                        Profesionalus spąstas
                      </div>
                      
                      {/* Pricing */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold" style={{ color: brandColors.primary }}>
                            {formattedPrice}
                          </span>
                        </div>
                      </div>
                      
                      {/* CTA Button */}
                      <button 
                        className="w-full py-2 text-sm font-medium text-white rounded transition-colors hover:opacity-90"
                        style={{ 
                          backgroundColor: brandColors.secondary
                        }}
                      >
                        Pridėti į krepšelį
                      </button>
                      
                      {/* Free Shipping */}
                      <div className="text-center mt-2">
                        <span className="text-xs text-green-600 font-medium">Nemokamas pristatymas</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}