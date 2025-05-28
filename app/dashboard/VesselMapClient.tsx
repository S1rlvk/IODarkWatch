'use client';

import { useEffect, useRef, useState } from 'react';
import { useVesselStore } from '../store/useVesselStore';
import dynamic from 'next/dynamic';

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
  const mapRef = useRef<any>(null);
  const vessels = useVesselStore(state => state.vessels);
  const selectedAlert = useVesselStore(state => state.selectedAlert);

  useEffect(() => {
    // Import Leaflet only on client side
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      // Import CSS dynamically
      require('leaflet/dist/leaflet.css');

      // Fix for default marker icons in Leaflet with Next.js
      const DefaultIcon = leaflet.default.icon({
        iconUrl: '/images/marker-icon.png',
        iconRetinaUrl: '/images/marker-icon-2x.png',
        shadowUrl: '/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      leaflet.default.Marker.prototype.options.icon = DefaultIcon;
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

  const getVesselIcon = (status: string) => {
    if (!L) return null;
    
    const color = status === 'active' ? '#68d391' : status === 'dark' ? '#f56565' : '#ed8936';
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
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  };

  if (!L) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[13, 74.7]} // Center on the Indian Ocean region
      zoom={6}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
      className="rounded-xl"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {vessels.map((vessel) => (
        <Marker
          key={vessel.id}
          position={[vessel.location.lat, vessel.location.lng]}
          icon={getVesselIcon(vessel.status)}
        >
          <Popup>
            <div className="vessel-popup p-2">
              <h4 className="text-lg font-semibold mb-2 text-gray-900">{vessel.name}</h4>
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{vessel.type}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium capitalize ${
                    vessel.status === 'active' ? 'text-green-600' : 
                    vessel.status === 'dark' ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {vessel.status}
                  </span>
                </p>
                {vessel.speed > 0 && (
                  <p className="flex items-center gap-2">
                    <span className="text-gray-600">Speed:</span>
                    <span className="font-medium">{vessel.speed} knots</span>
                  </p>
                )}
                {vessel.course > 0 && (
                  <p className="flex items-center gap-2">
                    <span className="text-gray-600">Course:</span>
                    <span className="font-medium">{vessel.course}°</span>
                  </p>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 