'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Vessel, Alert } from '../types';

// Fix Leaflet marker icon issue
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

interface MapComponentProps {
  vessels: Vessel[];
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
  selectedAlert: Alert | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ vessels, alerts, onAlertClick, selectedAlert }) => {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  // Custom icon for dark vessels
  const darkVesselIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Custom icon for active vessels
  const activeVesselIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[15, 75]} // Center on Indian Ocean
        zoom={5}
        className="h-full w-full"
        style={{ background: '#111' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Display vessels */}
        {vessels.map(vessel => (
          <Marker
            key={vessel.id}
            position={[vessel.location.lat, vessel.location.lng]}
            icon={vessel.status === 'dark' ? darkVesselIcon : activeVesselIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="text-lg font-bold mb-2">{vessel.name}</h3>
                <p className="text-sm text-gray-600">Type: {vessel.type}</p>
                <p className="text-sm text-gray-600">Status: {vessel.status}</p>
                <p className="text-sm text-gray-600">Speed: {vessel.speed} knots</p>
                <p className="text-sm text-gray-600">Course: {vessel.course}°</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Display alerts */}
        {alerts.map(alert => (
          <Marker
            key={alert.id}
            position={[alert.location.lat, alert.location.lng]}
            eventHandlers={{
              click: () => onAlertClick(alert)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="text-lg font-bold mb-2 text-accent-blue">Alert: {alert.type}</h3>
                <p className="text-sm text-gray-600">Vessel: {alert.vessel}</p>
                <p className="text-sm text-gray-600">Severity: {alert.severity}</p>
                <p className="text-sm text-gray-600">Time: {new Date(alert.timestamp).toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-2">{alert.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent; 