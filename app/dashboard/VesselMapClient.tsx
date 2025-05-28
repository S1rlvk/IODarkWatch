'use client';

import { useEffect, useRef, useState } from 'react';
import { useVesselStore } from '../store/useVesselStore';
import dynamic from 'next/dynamic';
import { 
  MapIcon, 
  ViewfinderCircleIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components with no SSR
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

export default function VesselMapClient() {
  const [L, setL] = useState<any>(null);
  const [showSatellite, setShowSatellite] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const vessels = useVesselStore(state => state.vessels);
  const selectedAlert = useVesselStore(state => state.selectedAlert);

  useEffect(() => {
    // Import Leaflet only on client side
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);

      // Create a custom default icon
      const DefaultIcon = leaflet.default.divIcon({
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

      leaflet.default.Marker.prototype.options.icon = DefaultIcon;
    }).catch((error) => {
      console.error('Failed to load Leaflet:', error);
      setMapError('Failed to load map. Please refresh the page.');
    });
  }, []);

  useEffect(() => {
    if (selectedAlert && mapRef.current && L) {
      mapRef.current.setView(
        [selectedAlert.location.lat, selectedAlert.location.lng],
        12
      );
    }
  }, [selectedAlert, L]);

  const getVesselIcon = (status: string, confidence: number) => {
    if (!L) return null;
    
    const color = status === 'active' ? '#39FF14' : status === 'dark' ? '#FF5F5F' : '#00FFFF';
    const size = status === 'dark' ? 16 : 12; // Make dark vessels more prominent
    
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
          ` : ''}
          ${confidence > 0.8 ? `
            <div style="
              position: absolute;
              top: -8px;
              left: -8px;
              right: -8px;
              bottom: -8px;
              border-radius: 50%;
              border: 2px solid #39FF14;
              opacity: 0.3;
              animation: pulse 1.5s infinite;
            "></div>
          ` : ''}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  };

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A]">
        <div className="text-center">
          <p className="text-[#FF5F5F] text-lg">{mapError}</p>
        </div>
      </div>
    );
  }

  if (!L) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FFFF] mx-auto mb-4"></div>
          <p className="text-[#A0A0A0] text-lg">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" style={{ minHeight: '500px' }}>
      <MapContainer
        center={[13, 74.7]} // Center on the Indian Ocean region
        zoom={6}
        style={{ width: '100%', height: '100%', minHeight: '500px' }}
        ref={mapRef}
        className="rounded-xl"
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
        />
        {vessels.map((vessel) => (
          <Marker
            key={vessel.id}
            position={[vessel.location.lat, vessel.location.lng]}
            icon={getVesselIcon(vessel.status, vessel.confidence || 0)}
          >
            <Popup>
              <div className="vessel-popup p-2">
                <h4 className="text-lg font-semibold mb-2 text-[#E0E0E0]">{vessel.name}</h4>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="text-[#A0A0A0]">Type:</span>
                    <span className="font-medium capitalize text-[#E0E0E0]">{vessel.type}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#A0A0A0]">Status:</span>
                    <span className={`font-medium capitalize ${
                      vessel.status === 'active' ? 'text-[#39FF14]' : 
                      vessel.status === 'dark' ? 'text-[#FF5F5F]' : 'text-[#00FFFF]'
                    }`}>
                      {vessel.status}
                    </span>
                  </p>
                  {vessel.speed > 0 && (
                    <p className="flex items-center gap-2">
                      <span className="text-[#A0A0A0]">Speed:</span>
                      <span className="font-medium text-[#E0E0E0]">{vessel.speed} knots</span>
                    </p>
                  )}
                  {vessel.course > 0 && (
                    <p className="flex items-center gap-2">
                      <span className="text-[#A0A0A0]">Course:</span>
                      <span className="font-medium text-[#E0E0E0]">{vessel.course}°</span>
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <span className="text-[#A0A0A0]">Confidence:</span>
                    <span className="font-medium text-[#E0E0E0]">{((vessel.confidence || 0) * 100).toFixed(1)}%</span>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setShowSatellite(!showSatellite)}
          className={`p-2 rounded-lg ${
            showSatellite ? 'bg-[#00FFFF] text-[#121212]' : 'bg-[#1A1A1A] text-[#E0E0E0]'
          } hover:bg-[#222] transition-colors`}
          title="Toggle Satellite View"
        >
          <ViewfinderCircleIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`p-2 rounded-lg ${
            showHeatmap ? 'bg-[#00FFFF] text-[#121212]' : 'bg-[#1A1A1A] text-[#E0E0E0]'
          } hover:bg-[#222] transition-colors`}
          title="Toggle AIS Heatmap"
        >
          <ChartBarIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
} 