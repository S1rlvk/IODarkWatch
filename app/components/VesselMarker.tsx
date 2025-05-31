'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Vessel } from '../types';
import { analyzeDarkVessel } from '../utils/darkVesselDetection';

// Dynamically import react-leaflet components
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface VesselMarkerProps {
  vessel: Vessel;
  onClick: () => void;
  isSelected: boolean;
}

const VesselMarker: React.FC<VesselMarkerProps> = ({ vessel, onClick, isSelected }) => {
  const analysis = analyzeDarkVessel(vessel);
  
  // Color coding for vessel status
  const getVesselColor = () => {
    if (vessel.status === 'dark') return '#ef4444'; // Red for dark vessels
    if (vessel.status === 'alert' || vessel.suspicious) return '#f59e0b'; // Orange for suspicious
    return '#3b82f6'; // Blue for active
  };

  const vesselColor = getVesselColor();

  const formatLastTransmission = () => {
    if (!vessel.lastAisTransmission) return 'Unknown';
    const hours = analysis.lastTransmissionHours;
    if (!hours) return 'Unknown';
    
    if (hours < 1) return `${Math.round(hours * 60)} minutes ago`;
    if (hours < 24) return `${Math.round(hours)} hours ago`;
    return `${Math.round(hours / 24)} days ago`;
  };

  return (
    <CircleMarker
      center={[vessel.location.lat, vessel.location.lng]}
      radius={isSelected ? 10 : (vessel.status === 'dark' ? 8 : 6)}
      eventHandlers={{
        click: onClick
      }}
      pathOptions={{
        color: vesselColor,
        fillColor: vesselColor,
        fillOpacity: isSelected ? 0.8 : 0.6,
        weight: isSelected ? 3 : (vessel.status === 'dark' ? 2 : 1),
        stroke: true
      }}
    >
      <Popup>
        <div className="p-3 min-w-[280px]">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-white">{vessel.name}</h3>
            <span 
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                vessel.status === 'dark' ? 'bg-red-500/20 text-red-400' :
                vessel.status === 'alert' ? 'bg-orange-500/20 text-orange-400' :
                'bg-blue-500/20 text-blue-400'
              }`}
            >
              {vessel.status.toUpperCase()}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">
              <span className="font-medium">Type:</span> {vessel.type}
            </p>
            <p className="text-gray-300">
              <span className="font-medium">Speed:</span> {vessel.speed} knots
            </p>
            <p className="text-gray-300">
              <span className="font-medium">Course:</span> {vessel.course}°
            </p>
            <p className="text-gray-300">
              <span className="font-medium">Position:</span> {vessel.location.lat.toFixed(4)}°, {vessel.location.lng.toFixed(4)}°
            </p>
            
            {vessel.lastAisTransmission && (
              <p className="text-gray-300">
                <span className="font-medium">Last AIS:</span> {formatLastTransmission()}
              </p>
            )}
            
            {vessel.confidence !== undefined && (
              <p className="text-gray-300">
                <span className="font-medium">Confidence:</span> {(vessel.confidence * 100).toFixed(1)}%
              </p>
            )}
            
            {vessel.aisMatch !== undefined && (
              <p className="text-gray-300">
                <span className="font-medium">AIS Match:</span> 
                <span className={vessel.aisMatch ? 'text-green-400' : 'text-red-400'}>
                  {vessel.aisMatch ? ' Yes' : ' No'}
                </span>
              </p>
            )}
            
            {analysis.reason.length > 0 && (
              <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded">
                <p className="text-red-300 font-medium text-xs mb-1">ALERTS:</p>
                {analysis.reason.map((reason, index) => (
                  <p key={index} className="text-red-200 text-xs">• {reason}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
};

export default VesselMarker; 