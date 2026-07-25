'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  model3dUrl?: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
}

interface RelatedProductsSliderProps {
  products: Product[];
}

export default function RelatedProductsSlider({ products }: RelatedProductsSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [products]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-16 sm:mt-20 pt-8 sm:pt-10 border-t border-[#E0DCD4] animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-heading font-bold text-[var(--color-forest)]">
          Sản phẩm tương tự
        </h3>
        <Link
          href="/products"
          className="text-xs sm:text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-teak)] transition-colors whitespace-nowrap"
        >
          Xem tất cả &rarr;
        </Link>
      </div>

      {/* Horizontal Scroll Container with Overlay Side Navigation Arrows */}
      <div className="relative group">
        {/* Left Navigation Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            aria-label="Cuộn sản phẩm sang trái"
            className="absolute left-1 sm:-left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-lg text-[var(--color-forest)] border border-[#E0DCD4] hover:bg-[var(--color-forest)] hover:text-white backdrop-blur-sm transition-all duration-200 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Navigation Arrow */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            aria-label="Cuộn sản phẩm sang phải"
            className="absolute right-1 sm:-right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-lg text-[var(--color-forest)] border border-[#E0DCD4] hover:bg-[var(--color-forest)] hover:text-white backdrop-blur-sm transition-all duration-200 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Products List */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory py-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="w-[calc(50%-6px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-18px)] shrink-0 snap-start"
            >
              <ProductCard product={relatedProduct} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
