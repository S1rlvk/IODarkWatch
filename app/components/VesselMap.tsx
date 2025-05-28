import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useVesselStore } from '../store/useVesselStore';
import AlertMarker from './AlertMarker';

interface VesselMapProps {
  className?: string;
}

function MapController() {
  const map = useMap();
  const selectedAlert = useVesselStore(state => state.selectedAlert);

  useEffect(() => {
    if (selectedAlert) {
      map.flyTo(
        [selectedAlert.location.lat, selectedAlert.location.lng],
        12,
        { duration: 1.5 }
      );
    }
  }, [selectedAlert, map]);

  return null;
}

export default function VesselMap({ className = '' }: VesselMapProps) {
  const mapRef = useRef<L.Map>(null);
  const vessels = useVesselStore(state => state.getFilteredVessels());
  const alerts = useVesselStore(state => state.alerts);
  const selectedAlert = useVesselStore(state => state.selectedAlert);
  const setSelectedAlert = useVesselStore(state => state.setSelectedAlert);

  return (
    <div className={`h-[600px] w-full bg-[#111] rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {vessels.map(vessel => (
          <CircleMarker
            key={vessel.id}
            center={[vessel.lat, vessel.lon]}
            radius={Math.max(4, vessel.confidence * 10)}
            pathOptions={{
              color: vessel.status === 'dark' ? '#ef4444' : '#3b82f6',
              fillColor: vessel.status === 'dark' ? '#ef4444' : '#3b82f6',
              fillOpacity: 0.7,
              weight: 1
            }}
          >
            <div className="p-2">
              <p className="font-medium">{vessel.name || 'Unknown Vessel'}</p>
              <p className="text-sm text-gray-400">MMSI: {vessel.id}</p>
              <p className="text-sm text-gray-400">
                Confidence: {(vessel.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </CircleMarker>
        ))}
        {alerts.map(alert => (
          <AlertMarker
            key={alert.id}
            alert={alert}
            onClick={() => setSelectedAlert(alert)}
            isSelected={selectedAlert?.id === alert.id}
          />
        ))}
        <MapController />
      </MapContainer>
    </div>
  );
} 