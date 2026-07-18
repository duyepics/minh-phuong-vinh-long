'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Eye, EyeOff, Pause, Play, RotateCcw } from 'lucide-react';

// Định nghĩa kiểu cho custom element <model-viewer>
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          'auto-rotate'?: boolean;
          'camera-controls'?: boolean;
          ar?: boolean;
          'ar-modes'?: string;
          'ar-scale'?: string;
          'ios-src'?: string;
          'shadow-intensity'?: string;
          'exposure'?: string;
          'environment-image'?: string;
          poster?: string;
          'rotation-per-second'?: string;
          'interaction-prompt'?: string;
          style?: React.CSSProperties;
          class?: string;
          className?: string;
        },
        HTMLElement
      >;
    }
  }
}

export interface Hotspot {
  position: string; // VD: "1 1 1"
  normal: string; // VD: "0 1 0"
  label: string; // Tên hiển thị
}

interface ModelViewerProps {
  src: string;
  alt?: string;
  poster?: string;
  iosSrc?: string; // Tùy chọn file .usdz dành cho thiết bị iOS
  hotspots?: Hotspot[]; // Danh sách các điểm chú thích
}

export default function ModelViewer({ src, alt = '3D Model', poster, iosSrc, hotspots = [] }: ModelViewerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const modelViewerRef = useRef<HTMLElement>(null);

  const handleResetCamera = () => {
    if (modelViewerRef.current) {
      const viewer = modelViewerRef.current as any;
      viewer.cameraOrbit = 'auto auto auto';
      viewer.cameraTarget = 'auto auto auto';
      if (viewer.resetTurntableRotation) {
        viewer.resetTurntableRotation();
      }
    }
  };

  useEffect(() => {
    // Chỉ import module này ở client
    import('@google/model-viewer').catch(console.error);
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl animate-pulse">
        <span className="text-gray-400">Đang tải mô hình 3D...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#F5F1EB] shadow-inner group model-viewer-container">
      <model-viewer
        ref={modelViewerRef}
        src={src}
        ios-src={iosSrc}
        alt={alt}
        poster={poster}
        {...(isAutoRotate ? { 'auto-rotate': true } : {})}
        camera-controls
        shadow-intensity="1"
        exposure="1"
        ar
        ar-modes="webxr scene-viewer quick-look" // Tối ưu công nghệ AR
        ar-scale="auto" // Tự động scale
        interaction-prompt="auto"
        rotation-per-second="30deg"
        style={{ width: '100%', height: '100%', outline: 'none' }}
        class="w-full h-full"
      >
        {/* Nút AR Tùy chỉnh */}
        <button 
          slot="ar-button" 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full text-sm font-semibold text-[var(--color-forest)] shadow-lg flex items-center gap-2 border border-white hover:scale-105 active:scale-95 transition-all z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
          </svg>
          <span>Xem trong phòng của bạn</span>
        </button>

        {/* Render danh sách hotspots */}
        {hotspots.map((hotspot, index) => (
          <button
            key={index}
            className={`hotspot-btn relative flex items-center justify-center w-6 h-6 bg-white/90 backdrop-blur rounded-full border border-[var(--color-forest)]/30 text-[var(--color-forest)] shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10 ${!showHotspots ? 'hidden' : ''}`}
            slot={`hotspot-${index}`}
            data-position={hotspot.position}
            data-normal={hotspot.normal}
          >
            {/* Lõi bên trong */}
            <div className="w-2 h-2 bg-[var(--color-forest)] rounded-full animate-pulse" />
            
            {/* Nhãn tooltip */}
            <div className="hotspot-tooltip absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/95 backdrop-blur shadow-xl rounded-lg text-sm font-medium text-gray-800 whitespace-nowrap opacity-0 pointer-events-none transition-all duration-300 translate-y-2 border border-gray-100">
              {hotspot.label}
              {/* Mũi tên */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[6px] border-transparent border-t-white/95 drop-shadow-sm"></div>
            </div>
          </button>
        ))}
      </model-viewer>
      
      {/* Nút hướng dẫn */}
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-[var(--color-forest)] shadow-sm pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
        Dùng ngón tay/chuột để xoay & phóng to
      </div>

      {/* Nút Toggle Hotspots (Chỉ hiển thị nếu có hotspots) */}
      {hotspots.length > 0 && (
        <button
          onClick={() => setShowHotspots(!showHotspots)}
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full text-[var(--color-forest)] shadow-sm hover:bg-white transition-all hover:scale-105 active:scale-95"
          title={showHotspots ? "Ẩn chú thích" : "Hiện chú thích"}
        >
          {showHotspots ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}

      {/* Cụm điều khiển Camera / Quay */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-[var(--color-forest)] shadow-sm hover:bg-white transition-all hover:scale-105 active:scale-95"
          title={isAutoRotate ? "Tạm dừng xoay" : "Tự động xoay"}
        >
          {isAutoRotate ? <Pause size={18} /> : <Play size={18} />}
        </button>
        
        <button
          onClick={handleResetCamera}
          className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-[var(--color-forest)] shadow-sm hover:bg-white transition-all hover:scale-105 active:scale-95"
          title="Góc nhìn mặc định"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Styles cho hiệu ứng hover của Hotspot */}
      <style jsx>{`
        .hotspot-btn:hover .hotspot-tooltip,
        .hotspot-btn:focus .hotspot-tooltip {
          opacity: 1;
          transform: translateY(0) translateX(-50%);
        }
      `}</style>
    </div>
  );
}
