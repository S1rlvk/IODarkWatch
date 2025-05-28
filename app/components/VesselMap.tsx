import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useVesselStore } from '../store/useVesselStore';
import AlertMarker from './AlertMarker';

// Fix Leaflet default icon issue
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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
    <div className={`h-[600px] w-full bg-[#0a0a0a] rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        className="h-full w-full"
        ref={mapRef}
        zoomControl={false}
        style={{ background: '#0a0a0a' }}
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
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="text-lg font-bold mb-2 text-white">{vessel.name || 'Unknown Vessel'}</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Status:</span>{' '}
                    <span className={vessel.status === 'dark' ? 'text-red-500' : 'text-blue-500'}>
                      {vessel.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Type:</span> {vessel.type}
                  </p>
                  {vessel.mmsi && (
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">MMSI:</span> {vessel.mmsi}
                    </p>
                  )}
                  {vessel.imo && (
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">IMO:</span> {vessel.imo}
                    </p>
                  )}
                  {vessel.flag && (
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Flag:</span> {vessel.flag}
                    </p>
                  )}
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Last Update:</span>{' '}
                    {new Date(vessel.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Confidence:</span>{' '}
                    {(vessel.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </Popup>
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