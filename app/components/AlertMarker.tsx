'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Alert } from '../types';

// Dynamically import react-leaflet components
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface AlertMarkerProps {
  alert: Alert;
  onClick: () => void;
  isSelected: boolean;
}

const AlertMarker: React.FC<AlertMarkerProps> = ({ alert, onClick, isSelected }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <CircleMarker
      center={[alert.location.lat, alert.location.lng]}
      radius={isSelected ? 10 : 8}
      eventHandlers={{
        click: onClick
      }}
      pathOptions={{
        color: getSeverityColor(alert.severity),
        fillColor: getSeverityColor(alert.severity),
        fillOpacity: isSelected ? 0.8 : 0.6,
        weight: isSelected ? 3 : 2
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="text-lg font-bold mb-2">{alert.type}</h3>
          <p className="text-sm text-gray-300">Severity: {alert.severity}</p>
          <p className="text-sm text-gray-300">Time: {new Date(alert.timestamp).toLocaleString()}</p>
          <p className="text-sm text-gray-300 mt-2">{alert.description}</p>
          {alert.vessel && (
            <p className="text-sm text-gray-300">Vessel: {alert.vessel}</p>
          )}
        </div>
      </Popup>
    </CircleMarker>
  );
};

export default AlertMarker; 