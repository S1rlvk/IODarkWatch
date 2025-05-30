'use client';

import React from 'react';
import { CircleMarker, Popup } from 'react-leaflet';
import { Vessel } from '../types';

interface VesselMarkerProps {
  vessel: Vessel;
  onClick: () => void;
  isSelected: boolean;
}

const VesselMarker: React.FC<VesselMarkerProps> = ({ vessel, onClick, isSelected }) => {
  return (
    <CircleMarker
      center={[vessel.location.lat, vessel.location.lng]}
      radius={isSelected ? 8 : 6}
      eventHandlers={{
        click: onClick
      }}
      pathOptions={{
        color: vessel.status === 'dark' ? '#ef4444' : '#3b82f6',
        fillColor: vessel.status === 'dark' ? '#ef4444' : '#3b82f6',
        fillOpacity: isSelected ? 0.8 : 0.6,
        weight: isSelected ? 2 : 1
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
  );
};

export default VesselMarker; 