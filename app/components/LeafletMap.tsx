'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useVesselStore } from '../store/useVesselStore';
import { analyzeDarkVessel } from '../utils/darkVesselDetection';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function LeafletMap() {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const vessels = useVesselStore(state => state.vessels);

  useEffect(() => {
    // Initialize map only once
    if (!mapRef.current && containerRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center: [-5, 75], // Indian Ocean
        zoom: 5,
        zoomControl: true,
        attributionControl: true,
      });

      // Add dark tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapRef.current);

      // Style the zoom control
      setTimeout(() => {
        const zoomControl = document.querySelector('.leaflet-control-zoom');
        if (zoomControl) {
          zoomControl.classList.add('!bg-black/80', '!border-white/20', 'backdrop-blur-sm', 'rounded-lg', 'overflow-hidden');
        }
      }, 100);
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add vessel markers
    vessels.forEach(vessel => {
      const color = vessel.status === 'dark' ? '#ef4444' : 
                   vessel.status === 'alert' ? '#f59e0b' : 
                   '#10b981';
      
      const icon = L.divIcon({
        className: 'vessel-marker',
        html: `
          <div class="vessel-marker-inner" style="
            background-color: ${color};
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            position: relative;
          ">
            ${vessel.status === 'dark' ? `
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 2px solid ${color};
                opacity: 0.5;
                animation: pulse 2s infinite;
              "></div>
            ` : ''}
          </div>
        `,
        iconSize: [vessel.status === 'dark' ? 32 : 20, vessel.status === 'dark' ? 32 : 20],
        iconAnchor: [vessel.status === 'dark' ? 16 : 10, vessel.status === 'dark' ? 16 : 10]
      });

      const marker = L.marker([vessel.location.lat, vessel.location.lng], { icon })
        .addTo(mapRef.current!);

      // Create popup content
      const analysis = analyzeDarkVessel(vessel);
      const popupContent = `
        <div class="vessel-popup">
          <h4>${vessel.name}</h4>
          <p><strong>Type:</strong> ${vessel.type}</p>
          <p><strong>Status:</strong> <span style="color: ${color}">${vessel.status.toUpperCase()}</span></p>
          <p><strong>Speed:</strong> ${vessel.speed} knots</p>
          <p><strong>Course:</strong> ${vessel.course}°</p>
          <p><strong>Position:</strong> ${vessel.location.lat.toFixed(4)}°, ${vessel.location.lng.toFixed(4)}°</p>
          ${vessel.confidence ? `<p><strong>Confidence:</strong> ${(vessel.confidence * 100).toFixed(1)}%</p>` : ''}
          ${analysis.reason.length > 0 ? `
            <div class="alerts">
              <strong>⚠️ Alerts:</strong>
              ${analysis.reason.map(r => `<p>• ${r}</p>`).join('')}
            </div>
          ` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });
  }, [vessels]);

  return <div ref={containerRef} className="w-full h-full rounded-xl" style={{ minHeight: '100%' }} />;
} 