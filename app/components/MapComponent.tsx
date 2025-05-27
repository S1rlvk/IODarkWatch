'use client';

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Vessel, Alert } from '../types';
import { VesselMarker } from './VesselMarker';
import { AlertMarker } from './AlertMarker';

// Fix Leaflet default icon
const DefaultIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  vessels: Vessel[];
  alerts: Alert[];
  onVesselSelect: (vessel: Vessel) => void;
  selectedVessel: Vessel | null;
}

const MapComponent: React.FC<MapComponentProps> = ({
  vessels,
  alerts,
  onVesselSelect,
  selectedVessel
}) => {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, []);

  return (
    <div className="h-full w-full bg-bg-primary">
      <MapContainer
        center={[15.5, 73.8]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        className="industrial-map"
      >
        <div className="bg-surface border border-border rounded-sm">
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
        </div>
        
        {/* Dummy dark ship marker with neon effect */}
        <Marker position={[-5, 75]}>
          <Popup className="industrial-popup">
            <div className="font-body">
              <h3 className="font-heading text-lg font-bold text-accent-blue mb-2">⚠️ Dark Ship Detected</h3>
              <p className="text-gray-300">Date: May 2025</p>
              <p className="text-gray-300">Location: 5°S, 75°E</p>
            </div>
          </Popup>
        </Marker>
        
        {vessels.map((vessel) => (
          <VesselMarker
            key={vessel.id}
            vessel={vessel}
            onClick={() => onVesselSelect(vessel)}
            isSelected={selectedVessel?.id === vessel.id}
          />
        ))}
        
        {alerts.map((alert) => (
          <AlertMarker
            key={alert.id}
            alert={alert}
            onClick={() => onVesselSelect(alert.vessel)}
            isSelected={selectedVessel?.id === alert.vessel.id}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent; 