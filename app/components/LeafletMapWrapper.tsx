'use client';

import { useEffect, useState } from 'react';
import { useVesselStore } from '../store/useVesselStore';

export default function LeafletMapWrapper() {
  const [map, setMap] = useState<any>(null);
  const vessels = useVesselStore(state => state.vessels);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      // Fix Leaflet's default icon path issues
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });

      const mapInstance = L.map('map').setView([13.0, 74.7], 6);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);
      
      setMap(mapInstance);
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!map || typeof window === 'undefined') return;

    // Dynamically import Leaflet for vessel markers
    import('leaflet').then((L) => {
      // Clear existing markers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add vessel markers
      vessels.forEach(vessel => {
        const color = vessel.status === 'dark' ? 'red' : 'green';
        const marker = L.marker([vessel.location.lat, vessel.location.lng], {
          icon: L.divIcon({
            className: 'vessel-marker',
            html: `<div style="background: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })
        }).addTo(map);

        marker.bindPopup(`
          <div>
            <h3>${vessel.name}</h3>
            <p>Status: ${vessel.status}</p>
            <p>Speed: ${vessel.speed} knots</p>
          </div>
        `);
      });
    });
  }, [map, vessels]);

  return <div id="map" style={{ width: '100%', height: '100%', minHeight: '500px' }} />;
} 