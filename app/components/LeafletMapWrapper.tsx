'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map component with no SSR
const LeafletMap = dynamic(
  () => import('./LeafletMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-cyan-500/20 rounded-full"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg mt-4">Initializing map...</p>
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl ${className}`}>
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-cyan-500/20 rounded-full"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg mt-4">Preparing map...</p>
        </div>
      </div>
    );
  }

  return <LeafletMap />;
} 