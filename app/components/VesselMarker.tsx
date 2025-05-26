import React from 'react';
import { Marker as LeafletMarker } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Vessel } from '../types';

interface VesselMarkerProps {
  vessel: Vessel;
  onClick: () => void;
}

export const VesselMarker: React.FC<VesselMarkerProps> = ({ vessel, onClick }) => {
  const icon = new Icon({
    iconUrl: '/vessel-icon.png',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });

  return (
    <LeafletMarker
      position={vessel.position}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    />
  );
}; 