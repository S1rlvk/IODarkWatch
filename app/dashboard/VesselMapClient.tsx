'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useVesselStore } from '../store/useVesselStore';

// Fix for default marker icons in Leaflet with Next.js
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

export default function VesselMapClient() {
  const mapRef = useRef<L.Map>(null);
  const vessels = useVesselStore(state => state.vessels);
  const selectedAlert = useVesselStore(state => state.selectedAlert);

  useEffect(() => {
    if (selectedAlert && mapRef.current) {
      mapRef.current.setView(
        [selectedAlert.location.lat, selectedAlert.location.lng],
        12
      );
    }
  }, [selectedAlert]);

  const getVesselIcon = (status: string) => {
    const color = status === 'active' ? '#68d391' : status === 'dark' ? '#f56565' : '#ed8936';
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  };

  return (
    <MapContainer
      center={[0, 60]}
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
      className="rounded-lg"
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
            <div className="vessel-popup">
              <h4 className="text-lg font-semibold mb-2">{vessel.name}</h4>
              <p>Type: {vessel.type}</p>
              <p>Speed: {vessel.speed} knots</p>
              <p>Course: {vessel.course}°</p>
              <div className={`vessel-status status-${vessel.status}`}>
                {vessel.status.toUpperCase()}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 