'use client';

import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useVesselStore } from '../store/useVesselStore';
import { Vessel, Alert } from '../types';
import AlertMarker from './AlertMarker';

interface VesselMapProps {
  className?: string;
}

export default function VesselMap({ className = '' }: VesselMapProps) {
  const mapRef = useRef<L.Map>(null);
  const vessels = useVesselStore(state => state.getFilteredVessels());
  const alerts = useVesselStore(state => state.alerts);
  const selectedAlert = useVesselStore(state => state.selectedAlert);
  const setSelectedAlert = useVesselStore(state => state.setSelectedAlert);

  // Fix Leaflet marker icon issue
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  // Center map on selected alert
  useEffect(() => {
    if (selectedAlert && mapRef.current) {
      mapRef.current.setView(
        [selectedAlert.location.lat, selectedAlert.location.lng],
        8
      );
    }
  }, [selectedAlert]);

  return (
    <div className={`h-full w-full relative ${className}`}>
      <MapContainer
        center={[15, 75]} // Center on Indian Ocean
        zoom={5}
        className="h-full w-full"
        style={{ background: '#111' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Display vessels */}
        {vessels.map(vessel => (
          <CircleMarker
            key={vessel.id}
            center={[vessel.location.lat, vessel.location.lng]}
            radius={6}
            pathOptions={{
              color: vessel.status === 'dark' ? '#ef4444' : '#3b82f6',
              fillColor: vessel.status === 'dark' ? '#ef4444' : '#3b82f6',
              fillOpacity: 0.6,
              weight: 1
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="text-lg font-bold mb-2">{vessel.name}</h3>
                <p className="text-sm text-gray-300">Type: {vessel.type}</p>
                <p className="text-sm text-gray-300">Status: {vessel.status}</p>
                <p className="text-sm text-gray-300">Speed: {vessel.speed} knots</p>
                <p className="text-sm text-gray-300">Course: {vessel.course}°</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Display alerts */}
        {alerts.map(alert => (
          <AlertMarker
            key={alert.id}
            alert={alert}
            onClick={() => setSelectedAlert(alert)}
            isSelected={selectedAlert?.id === alert.id}
          />
        ))}
      </MapContainer>
    </div>
  );
} 