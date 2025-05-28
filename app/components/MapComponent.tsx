'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { sampleVessels, sampleAlerts } from '../data/sampleVessels';

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
  alerts: any[];
  onAlertClick: (alert: any) => void;
  selectedAlert: any;
}

const MapComponent: React.FC<MapComponentProps> = ({ alerts, onAlertClick, selectedAlert }) => {
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
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={[15, 75]} // Center on Indian Ocean
        zoom={5}
        style={{ height: '100%', width: '100%', background: '#111' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Display vessels */}
        {sampleVessels.map(vessel => (
          <Marker
            key={vessel.id}
            position={[vessel.location.lat, vessel.location.lng]}
            icon={vessel.status === 'dark' ? darkVesselIcon : activeVesselIcon}
          >
            <Popup>
              <div style={{ color: '#000' }}>
                <h3 style={{ marginBottom: '5px' }}>{vessel.name}</h3>
                <p>Type: {vessel.type}</p>
                <p>Status: {vessel.status}</p>
                <p>Last Seen: {new Date(vessel.lastSeen).toLocaleString()}</p>
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
              <div style={{ color: '#000' }}>
                <h3 style={{ marginBottom: '5px' }}>Alert: {alert.type}</h3>
                <p>Severity: {alert.severity}</p>
                <p>Time: {new Date(alert.timestamp).toLocaleString()}</p>
                <p>{alert.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent; 