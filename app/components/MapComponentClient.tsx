'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useVesselStore } from '../store/useVesselStore';
import { 
  ViewfinderCircleIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import { logDiagnostics } from '../utils/mapDiagnostics';
import { analyzeDarkVessel } from '../utils/darkVesselDetection';

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export default function MapComponentClient() {
  const [showSatellite, setShowSatellite] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const vessels = useVesselStore(state => state.vessels);
  const selectedAlert = useVesselStore(state => state.selectedAlert);

  // Fix Leaflet icon issue
  useEffect(() => {
    // Run diagnostics in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => logDiagnostics(), 1000);
    }

    try {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Create custom default icon
      const DefaultIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            background-color: #00FFFF;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      L.Marker.prototype.options.icon = DefaultIcon;
      console.log('[MapClient] Leaflet icons configured');
    } catch (error) {
      console.error('[MapClient] Icon setup error:', error);
    }
  }, []);

  // Center map on selected alert
  useEffect(() => {
    if (selectedAlert && mapRef.current && isMapReady) {
      try {
        mapRef.current.setView(
          [selectedAlert.location.lat, selectedAlert.location.lng],
          12
        );
      } catch (error) {
        console.error('[MapClient] Failed to center on alert:', error);
      }
    }
  }, [selectedAlert, isMapReady]);

  const getVesselIcon = (status: string, confidence: number) => {
    try {
      // Enhanced color coding for dark vessel detection
      const color = status === 'dark' ? '#ef4444' : // Red for dark vessels
                   status === 'alert' ? '#f59e0b' : // Orange for alerts/suspicious
                   '#39FF14'; // Green for active
      const size = status === 'dark' ? 18 : status === 'alert' ? 16 : 12;
      
      return L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="relative">
            <div style="
              background-color: ${color};
              width: ${size}px;
              height: ${size}px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 10px rgba(0,0,0,0.3);
              position: relative;
              z-index: 1;
            "></div>
            ${status === 'dark' ? `
              <div style="
                position: absolute;
                top: -4px;
                left: -4px;
                right: -4px;
                bottom: -4px;
                border-radius: 50%;
                border: 2px solid ${color};
                opacity: 0.5;
                animation: pulse 2s infinite;
              "></div>
              <div style="
                position: absolute;
                top: -8px;
                left: -8px;
                right: -8px;
                bottom: -8px;
                border-radius: 50%;
                border: 2px solid ${color};
                opacity: 0.3;
                animation: pulse 2s infinite 0.5s;
              "></div>
            ` : ''}
            ${status === 'alert' ? `
              <div style="
                position: absolute;
                top: -4px;
                left: -4px;
                right: -4px;
                bottom: -4px;
                border-radius: 50%;
                border: 2px solid ${color};
                opacity: 0.5;
                animation: pulse 1.5s infinite;
              "></div>
            ` : ''}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      });
    } catch (error) {
      console.error('[MapClient] Icon creation error:', error);
      return undefined;
    }
  };

  return (
    <div className="w-full h-full relative industrial-map" style={{ minHeight: '500px' }}>
      <MapContainer
        center={[13, 74.7]} // Center on the Indian Ocean region
        zoom={6}
        style={{ width: '100%', height: '100%', minHeight: '500px' }}
        className="rounded-xl"
        whenReady={() => {
          setIsMapReady(true);
          console.log('[MapClient] Map is ready');
        }}
        ref={mapRef}
      >
        <TileLayer
          url={showSatellite 
            ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          }
          attribution={showSatellite 
            ? '&copy; <a href="https://www.esri.com/">Esri</a>'
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          }
          eventHandlers={{
            load: () => console.log('[MapClient] Tiles loaded'),
            tileerror: (e) => console.error('[MapClient] Tile error:', e)
          }}
        />
        
        {vessels.map((vessel) => {
          const icon = getVesselIcon(vessel.status, vessel.confidence || 0);
          if (!icon) return null;
          
          return (
            <Marker
              key={vessel.id}
              position={[vessel.location.lat, vessel.location.lng]}
              icon={icon}
            >
              <Popup>
                <div className="vessel-popup p-3 min-w-[300px]">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold text-[#E0E0E0]">{vessel.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      vessel.status === 'dark' ? 'bg-red-500/20 text-red-400' :
                      vessel.status === 'alert' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {vessel.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="text-[#A0A0A0]">Type:</span>
                      <span className="font-medium capitalize text-[#E0E0E0]">{vessel.type}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-[#A0A0A0]">Speed:</span>
                      <span className="font-medium text-[#E0E0E0]">{vessel.speed} knots</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-[#A0A0A0]">Course:</span>
                      <span className="font-medium text-[#E0E0E0]">{vessel.course}°</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-[#A0A0A0]">Position:</span>
                      <span className="font-medium text-[#E0E0E0] font-mono text-xs">
                        {vessel.location.lat.toFixed(4)}°, {vessel.location.lng.toFixed(4)}°
                      </span>
                    </p>
                    
                    {vessel.lastAisTransmission && (() => {
                      const analysis = analyzeDarkVessel(vessel);
                      const hours = analysis.lastTransmissionHours;
                      const formatTime = () => {
                        if (!hours) return 'Unknown';
                        if (hours < 1) return `${Math.round(hours * 60)} min ago`;
                        if (hours < 24) return `${Math.round(hours)} hrs ago`;
                        return `${Math.round(hours / 24)} days ago`;
                      };
                      
                      return (
                        <p className="flex items-center gap-2">
                          <span className="text-[#A0A0A0]">Last AIS:</span>
                          <span className={`font-medium ${hours && hours > 12 ? 'text-red-400' : 'text-[#E0E0E0]'}`}>
                            {formatTime()}
                          </span>
                        </p>
                      );
                    })()}
                    
                    <p className="flex items-center gap-2">
                      <span className="text-[#A0A0A0]">Confidence:</span>
                      <span className="font-medium text-[#E0E0E0]">{((vessel.confidence || 0) * 100).toFixed(1)}%</span>
                    </p>
                    
                    {vessel.aisMatch !== undefined && (
                      <p className="flex items-center gap-2">
                        <span className="text-[#A0A0A0]">AIS Match:</span>
                        <span className={vessel.aisMatch ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                          {vessel.aisMatch ? 'Yes' : 'No'}
                        </span>
                      </p>
                    )}
                    
                    {(() => {
                      const analysis = analyzeDarkVessel(vessel);
                      if (analysis.reason.length === 0) return null;
                      
                      return (
                        <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded">
                          <p className="text-red-300 font-medium text-xs mb-1">🚨 ALERTS:</p>
                          {analysis.reason.map((reason, index) => (
                            <p key={index} className="text-red-200 text-xs leading-relaxed">• {reason}</p>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setShowSatellite(!showSatellite)}
          className={`p-3 rounded-lg backdrop-blur-sm border transition-all ${
            showSatellite 
              ? 'bg-[#00FFFF]/20 border-[#00FFFF] text-[#00FFFF]' 
              : 'bg-black/30 border-white/20 text-white hover:bg-white/10'
          }`}
          title="Toggle Satellite View"
        >
          <ViewfinderCircleIcon className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`p-3 rounded-lg backdrop-blur-sm border transition-all ${
            showHeatmap 
              ? 'bg-[#00FFFF]/20 border-[#00FFFF] text-[#00FFFF]' 
              : 'bg-black/30 border-white/20 text-white hover:bg-white/10'
          }`}
          title="Toggle Heatmap"
        >
          <ChartBarIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <h4 className="text-white font-semibold mb-3 text-sm">Vessel Status</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#39FF14] border border-white"></div>
            <span className="text-[#A0A0A0] text-xs">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#ef4444] border border-white relative">
              <div className="absolute inset-0 border border-[#ef4444] rounded-full opacity-50 animate-ping"></div>
            </div>
            <span className="text-[#A0A0A0] text-xs">Dark Vessel (AIS Silent)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b] border border-white"></div>
            <span className="text-[#A0A0A0] text-xs">Suspicious/Alert</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[#A0A0A0] text-xs">
            🔴 Dark vessels: No AIS transmission 12+ hours
          </p>
          <p className="text-[#A0A0A0] text-xs mt-1">
            🟠 Suspicious: Speed 0 but position changes
          </p>
        </div>
      </div>
    </div>
  );
} 