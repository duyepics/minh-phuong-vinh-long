'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: { url: string; label?: string | null }[];
  initialIndex?: number;
  alt?: string;
}

export default function ImageLightbox({ images, initialIndex = 0, alt = 'Image' }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];
  const triggerImage = images[initialIndex] || images[0];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#F5F1EB] cursor-zoom-in group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <Image
            src={triggerImage.url}
            alt={triggerImage.label || alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div className="bg-white/90 text-[var(--color-forest)] p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-lg">
              <ZoomIn size={24} />
            </div>
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-[100vw] sm:max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 bg-black/95 border-none shadow-none [&>button]:bg-white/10 [&>button]:text-white [&>button]:hover:bg-white/20 [&>button]:w-10 [&>button]:h-10 [&>button]:rounded-full [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:z-50 [&>button]:top-4 [&>button]:right-4">
        <div className="sr-only">
          <DialogTitle>{alt}</DialogTitle>
          <DialogDescription>Hình ảnh chi tiết của {alt}</DialogDescription>
        </div>
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
          
          <div className="relative w-full flex-1 flex items-center justify-center p-4">
            <Image
              src={currentImage.url}
              alt={currentImage.label || alt}
              fill
              className="object-contain"
              sizes="100vw"
              quality={100}
            />
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={handlePrevious}
                  className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm focus:outline-none"
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm focus:outline-none"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="w-full flex justify-center pb-6 z-10">
              <div className="flex gap-3 overflow-x-auto p-3 bg-black/40 backdrop-blur-md rounded-2xl max-w-full">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentIndex(idx)} 
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 focus:outline-none ${currentIndex === idx ? 'ring-2 ring-[var(--color-gold)] scale-105' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <Image 
                      src={img.url} 
                      alt={img.label || alt} 
                      fill 
                      className="object-cover" 
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
