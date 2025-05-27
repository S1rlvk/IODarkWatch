'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Alert } from '../types';

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import('../components/MapComponent').then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white">Loading map...</div>
});

export default function Dashboard() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Dummy data for testing
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'dark_ship',
      location: { lat: 20, lng: 20 },
      timestamp: new Date().toISOString(),
      severity: 'high',
      description: 'Vessel detected with AIS turned off'
    }
  ];

  return (
    <main className="flex h-screen bg-gray-900">
      {/* Main map area */}
      <div className="flex-1 h-full">
        <MapComponent
          alerts={alerts}
          onAlertClick={setSelectedAlert}
          selectedAlert={selectedAlert}
        />
      </div>

      {/* Right sidebar */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">Vessel Details</h2>
        {selectedAlert ? (
          <div className="bg-gray-700 rounded p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Alert Details</h3>
            <p className="text-gray-300">Type: {selectedAlert.type}</p>
            <p className="text-gray-300">Severity: {selectedAlert.severity}</p>
            <p className="text-gray-300">Time: {new Date(selectedAlert.timestamp).toLocaleString()}</p>
            <p className="text-gray-300 mt-2">{selectedAlert.description}</p>
          </div>
        ) : (
          <p className="text-gray-400">Select a vessel on the map to view details</p>
        )}
      </div>
    </main>
  );
} 