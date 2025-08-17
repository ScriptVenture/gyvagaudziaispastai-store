"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Eye, Zap, TrendingUp } from "lucide-react";
import { brandColors } from "@/utils/colors";
import { getOptimizedImageUrl } from "@/utils/image";
import { STORE_API_URL, MEDUSA_PUBLISHABLE_KEY } from "@/lib/config";

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
    const response = await fetch(`${STORE_API_URL}/products?fields=*,images.*`, {
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
                
                // Enhanced dynamic data with more realistic patterns
                const mockStock = index < 2 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 20) + 10;
                const mockRating = 4.6 + Math.random() * 0.4;
                const mockReviews = Math.floor(Math.random() * 200) + 50;
                const isHotSelling = index === 0 || index === 2; // Mark certain products as hot
                const recentPurchases = Math.floor(Math.random() * 15) + 5;
                
                return (
                  <Link key={product.id} href={`/products/${product.handle}`} className="group">
                    <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]">
                      
                      {/* Enhanced Badge System */}
                      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
                        {mockStock <= 5 && (
                          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Tik {mockStock} liko
                            </div>
                          </div>
                        )}
                        {isHotSelling && (
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              HOT
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Bestseller Badge - Enhanced */}
                      <div className="absolute top-3 right-3 z-20">
                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          🏆 #1 BESTSELLER
                        </div>
                      </div>
                      
                      {/* Enhanced Product Image with Overlay Effects */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 h-56">
                        {(() => {
                          // Use thumbnail if available, otherwise use first image, otherwise fallback
                          let imageUrl = product.thumbnail;
                          
                          // If no thumbnail but images exist, use the first image
                          if (!imageUrl && product.images && product.images.length > 0) {
                            // Sort images by rank and get the first one
                            const sortedImages = [...product.images].sort((a, b) => a.rank - b.rank);
                            imageUrl = sortedImages[0].url;
                          }
                          
                          // Convert the URL to use our image optimization if needed
                          const optimizedImageUrl = imageUrl ? getOptimizedImageUrl(imageUrl) : "/imagen5.jpg";
                          
                          return (
                            <Image 
                              src={optimizedImageUrl} 
                              alt={product.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                          );
                        })()}
                        
                        {/* Gradient Overlay for Better Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Quick View Button - Modern 2025 Pattern */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full font-medium text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Peržiūrėti detaliai
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Product Content */}
                      <div className="p-4 space-y-3">
                        
                        {/* Rating with Enhanced Styling */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(mockRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600 ml-1 font-medium">
                              {mockRating.toFixed(1)} ({mockReviews})
                            </span>
                          </div>
                          
                          {/* Social Proof Indicator */}
                          <div className="text-xs text-green-600 font-medium">
                            {recentPurchases} nupirkta šią savaitę
                          </div>
                        </div>
                        
                        {/* Product Title with Better Typography */}
                        <h3 className="text-base font-semibold leading-tight line-clamp-2 text-gray-900 group-hover:text-green-700 transition-colors duration-200">
                          {product.title}
                        </h3>
                        
                        {/* Enhanced Key Features */}
                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            Profesionalus
                          </div>
                          <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            Humaniška
                          </div>
                        </div>
                        
                        {/* Enhanced Pricing Section */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex flex-col">
                            <span className="text-xl font-bold text-green-600">
                              {formattedPrice}
                            </span>
                            <span className="text-xs text-gray-500">
                              + nemokamas pristatymas
                            </span>
                          </div>
                          
                          {/* Availability Indicator */}
                          <div className="text-right">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              mockStock > 10 
                                ? 'bg-green-50 text-green-700' 
                                : mockStock > 5 
                                ? 'bg-yellow-50 text-yellow-700'
                                : 'bg-red-50 text-red-700'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                mockStock > 10 
                                  ? 'bg-green-500' 
                                  : mockStock > 5 
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500 animate-pulse'
                              }`}></div>
                              {mockStock > 10 ? 'Sandėlyje' : mockStock > 5 ? 'Mažai liko' : 'Skubėkite'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Modern CTA with Micro-interaction */}
                        <div className="pt-2">
                          <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 rounded-xl py-3 px-4 text-center transition-all duration-300 group-hover:shadow-md">
                            <span className="text-sm font-semibold text-green-700 group-hover:text-green-800 flex items-center justify-center gap-2">
                              <Eye className="w-4 h-4" />
                              Peržiūrėti produktą
                              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Subtle Border Animation */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-200 transition-colors duration-300 pointer-events-none"></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
