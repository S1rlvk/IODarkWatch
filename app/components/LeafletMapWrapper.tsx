'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useVesselStore } from '../store/useVesselStore';

// Dynamically import the entire Leaflet map with no SSR
const DynamicMap = dynamic(
  () => import('./MapComponentClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FFFF] mx-auto mb-4"></div>
          <p className="text-[#A0A0A0] text-lg">Initializing map...</p>
        </div>
      </div>
    )
  }
);

interface LeafletMapWrapperProps {
  className?: string;
}

export default function LeafletMapWrapper({ className = '' }: LeafletMapWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasRequiredCSS, setHasRequiredCSS] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if component is mounted (client-side)
    setIsMounted(true);

    // Verify Leaflet CSS is loaded
    const checkCSS = () => {
      const leafletCSS = document.querySelector('link[href*="leaflet"]');
      if (leafletCSS) {
        setHasRequiredCSS(true);
      } else {
        // If CSS not found, try to load it dynamically
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.onload = () => setHasRequiredCSS(true);
        document.head.appendChild(link);
      }
    };

    checkCSS();

    // Ensure container has proper height
    if (containerRef.current) {
      const container = containerRef.current;
      if (container.offsetHeight < 400) {
        container.style.minHeight = '500px';
      }
    }
  }, []);

  if (!isMounted) {
    return (
      <div 
        ref={containerRef}
        className={`w-full h-full flex items-center justify-center bg-[#1A1A1A] ${className}`}
        style={{ minHeight: '500px' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FFFF] mx-auto mb-4"></div>
          <p className="text-[#A0A0A0] text-lg">Preparing map...</p>
        </div>
      </div>
    );
  }

  if (!hasRequiredCSS) {
    return (
      <div 
        ref={containerRef}
        className={`w-full h-full flex items-center justify-center bg-[#1A1A1A] ${className}`}
        style={{ minHeight: '500px' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FFFF] mx-auto mb-4"></div>
          <p className="text-[#A0A0A0] text-lg">Loading map styles...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{ minHeight: '500px' }}
    >
      <DynamicMap />
    </div>
  );
} 