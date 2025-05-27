import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Alert } from '../types';

interface AlertMarkerProps {
  alert: Alert;
  onClick: () => void;
  isSelected: boolean;
}

export const AlertMarker: React.FC<AlertMarkerProps> = ({ alert, onClick, isSelected }) => {
  return (
    <Marker
      position={[alert.vessel.position.lat, alert.vessel.position.lng]}
      eventHandlers={{
        click: onClick
      }}
    >
      <Popup>
        <div>
          <h3>Alert: {alert.type}</h3>
          <p>Severity: {alert.severity}</p>
          <p>Description: {alert.description}</p>
          <p>Timestamp: {new Date(alert.timestamp).toLocaleString()}</p>
          <h4>Vessel Details:</h4>
          <p>Name: {alert.vessel.name}</p>
          <p>Type: {alert.vessel.type}</p>
          <p>Risk Level: {alert.vessel.riskLevel}</p>
        </div>
      </Popup>
    </Marker>
  );
}; 