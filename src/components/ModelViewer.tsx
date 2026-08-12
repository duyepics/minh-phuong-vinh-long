'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Eye, EyeOff, Pause, Play, RotateCcw } from 'lucide-react';

// Định nghĩa kiểu cho custom element <model-viewer> (Tương thích React 19)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'model-viewer': any;
      }
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
  const [isIOS, setIsIOS] = useState(false);
  // Vị trí nút AR iOS (fixed theo viewport, tránh bị clip bởi overflow:hidden)
  const [arBtnPos, setArBtnPos] = useState({ bottom: 16, left: 16 });
  const modelViewerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Tính vị trí nút AR theo viewport (cập nhật khi scroll/resize)
  const updateArBtnPosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setArBtnPos({
      bottom: window.innerHeight - rect.bottom + 16,
      left: rect.left + 16,
    });
  }, []);

  useEffect(() => {
    // Chỉ import module này ở client
    import('@google/model-viewer').catch(console.error);
    setIsMounted(true);
    // Detect iOS Safari để hiển thị nút AR thủ công qua portal
    const ua = navigator.userAgent;
    const isIOSDevice = /iPhone|iPad|iPod/.test(ua) && /WebKit/.test(ua) && !/CriOS|FxiOS/.test(ua);
    setIsIOS(isIOSDevice);
  }, []);

  useEffect(() => {
    if (!isIOS || !iosSrc) return;
    // Cập nhật vị trí ngay sau khi mount và khi scroll/resize
    updateArBtnPosition();
    window.addEventListener('scroll', updateArBtnPosition, { passive: true });
    window.addEventListener('resize', updateArBtnPosition, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateArBtnPosition);
      window.removeEventListener('resize', updateArBtnPosition);
    };
  }, [isIOS, iosSrc, isMounted, updateArBtnPosition]);

  useEffect(() => {
    const viewerRef = modelViewerRef.current as any;
    if (!viewerRef) return;

    const handleArStatus = (event: any) => {
      // Khi bắt đầu phiên AR, tắt xoay ngay lập tức để tránh vật thể trôi/di chuyển
      if (event.detail.status === 'session-started') {
        setIsAutoRotate(false);
        // Tắt trực tiếp trên element để tránh độ trễ của React state
        viewerRef.removeAttribute('auto-rotate');
      }
      // Khi AR kết thúc, khôi phục lại trạng thái trước
      if (event.detail.status === 'not-presenting') {
        // Không tự khôi phục auto-rotate, để người dùng tự bật lại nếu muốn
      }
    };

    viewerRef.addEventListener('ar-status', handleArStatus);
    return () => {
      viewerRef.removeEventListener('ar-status', handleArStatus);
    };
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl animate-pulse">
        <span className="text-gray-400">Đang tải mô hình 3D...</span>
      </div>
    );
  }

  // Nút AR iOS Quick Look — render vào document.body qua portal
  // Dùng position:fixed để không bị clip bởi overflow:hidden của bất kỳ ancestor nào
  // iOS Quick Look yêu cầu <img> là first child với src hợp lệ (không được empty)
  const IOS_AR_IMG = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const iosArButton = isIOS && iosSrc
    ? createPortal(
        <a
          href={iosSrc}
          rel="ar"
          style={{
            position: 'fixed',
            bottom: `${arBtnPos.bottom}px`,
            left: `${arBtnPos.left}px`,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '9999px',
            padding: '8px 12px 8px 8px',
            color: 'var(--color-forest)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            fontSize: '12px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
          title="Xem trong phòng của bạn (AR)"
        >
          {/* img PHẢI là first child với src hợp lệ — đây là yêu cầu bắt buộc của iOS Quick Look WebKit */}
          {/* Dùng 1×1 transparent GIF, phủ toàn button bằng position:absolute để không che UI */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IOS_AR_IMG}
            alt="Xem trong phòng của bạn"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.001 }}
          />
          {/* Icon & text hiển thị trên img */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 18, height: 18, flexShrink: 0, position: 'relative', zIndex: 1 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
          </svg>
          <span style={{ position: 'relative', zIndex: 1 }}>Xem AR</span>
        </a>,
        document.body
      )
    : null;


  return (
    <>
      <div ref={containerRef} className="relative w-full h-full rounded-2xl overflow-hidden bg-[#F5F1EB] shadow-inner group model-viewer-container">
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
          ar-modes="scene-viewer webxr quick-look"
          ar-scale="fixed"
          ar-placement="floor"
          xr-environment
          bounds="tight"
          interaction-prompt="none"
          rotation-per-second="30deg"
          disable-pan
          style={{ width: '100%', height: '100%', outline: 'none' }}
          class="w-full h-full"
        >
          {/* Nút AR slot — cho Android/WebXR; iOS dùng portal bên ngoài */}
          <button
            slot="ar-button"
            className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full text-[var(--color-forest)] shadow-sm hover:bg-white transition-all hover:scale-105 active:scale-95 z-10"
            title="Xem trong phòng của bạn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
            </svg>
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

      {/* Nút AR iOS Quick Look — render vào document.body qua React Portal */}
      {/* position:fixed đảm bảo không bị clip bởi overflow:hidden ancestor nào */}
      {iosArButton}
    </>
  );
}
