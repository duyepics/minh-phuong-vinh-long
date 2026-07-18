'use client';

import React, { useState } from 'react';
import ImageLightbox from './ImageLightbox';
import ModelViewer, { Hotspot } from './ModelViewer';
import Image from 'next/image';
import { Box, ImageIcon } from 'lucide-react';

interface ProductImage {
  id: string;
  url: string;
  label: string | null;
}

interface ProductMediaGalleryProps {
  imageUrl?: string | null;
  model3dUrl?: string | null;
  productName: string;
  hotspots?: Hotspot[];
  images?: ProductImage[];
}

export default function ProductMediaGallery({ imageUrl, model3dUrl, productName, hotspots, images = [] }: ProductMediaGalleryProps) {
  // Gộp ảnh chính và các ảnh phụ
  const allImages = [];
  if (imageUrl) {
    // Không dùng label cho ảnh chính theo ý thiết kế cũ, hoặc có thể để trống
    allImages.push({ url: imageUrl, label: null, id: 'primary' });
  }
  if (images && images.length > 0) {
    allImages.push(...images);
  }

  const has2D = allImages.length > 0;
  const has3D = !!model3dUrl;
  const hasBoth = has2D && has3D;
  const showTabs = has3D || allImages.length > 1;

  // activeView có thể là '3d' hoặc index của mảng allImages
  const [activeView, setActiveView] = useState<string | number>(has2D ? 0 : '3d');

  if (!has2D && !has3D) {
    return (
      <div className="w-full aspect-square md:aspect-[4/5] min-h-[400px] flex items-center justify-center bg-[#F5F1EB] rounded-3xl border-2 border-dashed border-[#E0DCD4]">
        <span className="text-[var(--color-slate)]">Sản phẩm đang cập nhật hình ảnh</span>
      </div>
    );
  }

  const currentImage = typeof activeView === 'number' ? allImages[activeView] : null;

  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Vùng hiển thị chính */}
      <div className="w-full aspect-square md:aspect-[4/3] lg:aspect-square xl:aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_4px_24px_-8px_rgba(0,0,0,0.1)] border border-[#E0DCD4]/30 relative bg-[#F5F1EB]">
        {currentImage ? (
          <>
            <ImageLightbox 
              images={allImages} 
              initialIndex={typeof activeView === 'number' ? activeView : 0} 
              alt={currentImage.label || productName} 
            />
            {currentImage.label && (
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-100/50">
                <span className="text-[var(--color-forest)] font-medium text-sm">
                  {currentImage.label}
                </span>
              </div>
            )}
          </>
        ) : activeView === '3d' && model3dUrl ? (
          <ModelViewer src={model3dUrl} alt={`Mô hình 3D của ${productName}`} hotspots={hotspots} />
        ) : null}
      </div>

      {/* Tabs / Thumbnails chuyển đổi bên dưới */}
      {showTabs && (
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-2">
          
          {/* Lặp qua danh sách 2D Images */}
          {allImages.map((img, index) => (
            <button
              key={img.id || index}
              onClick={() => setActiveView(index)}
              className={`group flex flex-col items-center gap-2 transition-all duration-300 ${activeView === index ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-colors ${activeView === index ? 'border-[var(--color-forest)] shadow-md' : 'border-transparent'}`}>
                <Image 
                  src={img.url} 
                  alt={img.label || "Ảnh thực tế"} 
                  fill 
                  className="object-cover"
                  sizes="80px"
                />
                {!img.label && index === 0 && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <ImageIcon size={18} className="text-white drop-shadow-md" />
                  </div>
                )}
              </div>
              <span className={`text-[10px] md:text-xs font-semibold ${activeView === index ? 'text-[var(--color-forest)]' : 'text-[var(--color-slate)]'} max-w-[80px] text-center truncate`} title={img.label || 'Ảnh chính'}>
                {img.label || 'Ảnh chính'}
              </span>
            </button>
          ))}
          
          {/* Nút 3D (Xem 3D) */}
          {has3D && (
            <button
              onClick={() => setActiveView('3d')}
              className={`group flex flex-col items-center gap-2 transition-all duration-300 ${activeView === '3d' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-colors bg-[#F5F1EB] ${activeView === '3d' ? 'border-[var(--color-forest)] shadow-md' : 'border-transparent'}`}>
                {imageUrl && (
                  <Image 
                    src={imageUrl} 
                    alt="Xem 3D" 
                    fill 
                    className="object-cover blur-[2px] scale-110"
                    sizes="80px"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Box size={24} className="text-white drop-shadow-md" />
                </div>
              </div>
              <span className={`text-[10px] md:text-xs font-semibold ${activeView === '3d' ? 'text-[var(--color-forest)]' : 'text-[var(--color-slate)]'}`}>
                Xem 3D
              </span>
            </button>
          )}

        </div>
      )}
    </div>
  );
}
