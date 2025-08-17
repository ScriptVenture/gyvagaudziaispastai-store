"use client"

import Image from "next/image";
import Link from "next/link";
import { Star, Eye, ShoppingCart } from "lucide-react";
import { getOptimizedImageUrl } from "@/utils/image";
import { brandColors } from "@/utils/colors";

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
  categories?: Array<{
    id: string;
    name: string;
  }>;
  tags?: Array<{
    value: string;
  }>;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (variantId: string) => void;
  showAddToCart?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  showAddToCart = false, 
  variant = 'default',
  className = '' 
}: ProductCardProps) {
  const mainVariant = product.variants?.[0];
  
  // Calculate price
  let price = 0;
  if (mainVariant?.calculated_price?.calculated_amount) {
    price = mainVariant.calculated_price.calculated_amount;
  } else if (mainVariant?.prices && mainVariant.prices.length > 0) {
    const eurPrice = mainVariant.prices.find(p => 
      p.currency_code === 'eur' || p.currency_code === 'EUR'
    );
    price = eurPrice?.amount || mainVariant.prices[0]?.amount || 0;
  }
  
  const formattedPrice = price > 1000 ? `€${(price / 100).toFixed(2)}` : `€${price.toFixed(2)}`;
  
  // Generate mock data for consistency
  const mockRating = 4.4 + Math.random() * 0.5;
  const mockReviews = Math.floor(Math.random() * 150) + 30;
  
  // Get optimized image URL
  const getImageUrl = () => {
    let imageUrl = product.thumbnail;
    
    if (!imageUrl && product.images && product.images.length > 0) {
      const sortedImages = [...product.images].sort((a, b) => a.rank - b.rank);
      imageUrl = sortedImages[0].url;
    }
    
    return imageUrl ? getOptimizedImageUrl(imageUrl) : "/imagen5.jpg";
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart && mainVariant) {
      onAddToCart(mainVariant.id);
    }
  };

  return (
    <Link href={`/products/${product.handle}`} className={`group block ${className}`}>
      <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer transform hover:-translate-y-1">
        
        {/* Product Image */}
        <div className={`relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${
          variant === 'compact' ? 'h-48' : 'h-56'
        }`}>
          <Image 
            src={getImageUrl()} 
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Quick View Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full font-medium text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Peržiūrėti detaliai
            </div>
          </div>
        </div>
        
        {/* Product Content */}
        <div className={`p-4 space-y-3 ${variant === 'compact' ? 'p-3 space-y-2' : ''}`}>
          
          {/* Rating */}
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
          </div>
          
          {/* Product Title */}
          <h3 className={`font-semibold leading-tight line-clamp-2 text-gray-900 group-hover:text-green-700 transition-colors duration-200 ${
            variant === 'compact' ? 'text-sm' : 'text-base'
          }`}>
            {product.title}
          </h3>
          
          {/* Tags from Backend */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {product.tags.slice(0, 3).map((tag, index) => {
                // Define tag colors based on common animal/trap types
                const getTagColor = (tagValue: string) => {
                  const lowerTag = tagValue.toLowerCase();
                  if (lowerTag.includes('cat') || lowerTag.includes('katė')) return 'bg-orange-50 text-orange-700 border-orange-200';
                  if (lowerTag.includes('squirrel') || lowerTag.includes('voverė')) return 'bg-amber-50 text-amber-700 border-amber-200';
                  if (lowerTag.includes('raccoon') || lowerTag.includes('meškėnas')) return 'bg-gray-50 text-gray-700 border-gray-200';
                  if (lowerTag.includes('rabbit') || lowerTag.includes('triušis')) return 'bg-pink-50 text-pink-700 border-pink-200';
                  if (lowerTag.includes('small') || lowerTag.includes('mažas')) return 'bg-green-50 text-green-700 border-green-200';
                  if (lowerTag.includes('medium') || lowerTag.includes('vidutinis')) return 'bg-blue-50 text-blue-700 border-blue-200';
                  if (lowerTag.includes('large') || lowerTag.includes('didelis')) return 'bg-purple-50 text-purple-700 border-purple-200';
                  if (lowerTag.includes('professional') || lowerTag.includes('profesionalus')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
                  return 'bg-gray-50 text-gray-700 border-gray-200';
                };

                return (
                  <div 
                    key={index} 
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getTagColor(tag.value)}`}
                  >
                    <div className="w-1.5 h-1.5 bg-current rounded-full opacity-60"></div>
                    {tag.value}
                  </div>
                );
              })}
              {product.tags.length > 3 && (
                <div className="inline-flex items-center gap-1 bg-gray-50 text-gray-500 px-2 py-1 rounded-full text-xs font-medium border border-gray-200">
                  +{product.tags.length - 3}
                </div>
              )}
            </div>
          )}
          
          {/* Pricing Section */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <span className={`font-bold text-green-600 ${
                variant === 'compact' ? 'text-lg' : 'text-xl'
              }`}>
                {formattedPrice}
              </span>
              <span className="text-xs text-gray-500">
                + nemokamas pristatymas
              </span>
            </div>
            
            {/* Availability Indicator */}
            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Sandėlyje
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="pt-2">
            {showAddToCart ? (
              <button
                onClick={handleAddToCartClick}
                disabled={!mainVariant}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white rounded-xl py-3 px-4 text-center transition-all duration-300 hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
              >
                <ShoppingCart className="w-4 h-4" />
                Į krepšelį
              </button>
            ) : (
              <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 rounded-xl py-3 px-4 text-center transition-all duration-300 group-hover:shadow-md">
                <span className="text-sm font-semibold text-green-700 group-hover:text-green-800 flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  Peržiūrėti produktą
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Subtle Border Animation */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-200 transition-colors duration-300 pointer-events-none"></div>
      </div>
    </Link>
  );
}
