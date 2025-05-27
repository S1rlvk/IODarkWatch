'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AlertMarker from './AlertMarker';
import { Alert } from '../types';

interface MapComponentProps {
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
  selectedAlert: Alert | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  alerts, 
  onAlertClick, 
  selectedAlert 
}) => {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      className="h-full w-full"
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Dark Map">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay checked name="OpenSeaMap">
          <TileLayer
            url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
            attribution='Map data: &copy; <a href="https://www.openseamap.org">OpenSeaMap</a> contributors'
          />
        </LayersControl.Overlay>
      </LayersControl>

      {/* Dummy dark ship marker */}
      <Marker position={[20, 20]}>
        <Popup>
          <div className="p-2">
            <h3 className="text-lg font-bold mb-2 text-accent-blue">Dark Ship Detected</h3>
            <p className="text-sm text-gray-300">Vessel: MV Unknown</p>
            <p className="text-sm text-gray-300">Last seen: 2 hours ago</p>
            <p className="text-sm text-accent-teal mt-2">Risk Level: High</p>
          </div>
        </Popup>
      </Marker>

      {alerts.map((alert) => (
        <AlertMarker
          key={alert.id}
          alert={alert}
          onClick={() => onAlertClick(alert)}
          isSelected={selectedAlert?.id === alert.id}
        />
      ))}
    </MapContainer>
  );
};

export default MapComponent; 