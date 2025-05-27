'use client';

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Alert } from '../types';

interface AlertMarkerProps {
  alert: Alert;
  onClick: () => void;
  isSelected: boolean;
}

const AlertMarker: React.FC<AlertMarkerProps> = ({ alert, onClick, isSelected }) => {
  return (
    <Marker 
      position={[alert.location.lat, alert.location.lng]}
      eventHandlers={{
        click: onClick
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="text-lg font-bold mb-2 text-accent-blue">Alert: {alert.type}</h3>
          <p className="text-sm text-gray-300">Severity: {alert.severity}</p>
          <p className="text-sm text-gray-300">Time: {new Date(alert.timestamp).toLocaleString()}</p>
          <p className="text-sm text-gray-300 mt-2">{alert.description}</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default AlertMarker; 