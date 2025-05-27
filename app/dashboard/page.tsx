'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - IODarkWatch',
  description: 'Maritime Domain Awareness Dashboard',
};

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import('../components/MapComponent').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-gray-800 text-white rounded-lg">
      Loading map...
    </div>
  )
});

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Maritime Domain Awareness</h1>
      <p className="text-gray-400 mb-8">Real-time vessel tracking in the Indian Ocean</p>

      <div className="mb-8">
        <p className="text-lg">Loading dashboard...</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Active Vessels</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Dark Vessels</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Alerts</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">Filter Vessels</button>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">View Alerts</button>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">Export Data</button>
      </div>

      <div className="h-[600px] bg-gray-800 rounded-lg overflow-hidden">
        <MapComponent
          alerts={[]}
          onAlertClick={() => {}}
          selectedAlert={null}
        />
      </div>

      <div className="mt-8 text-center">
        <button className="text-blue-400 hover:text-blue-300 transition-colors">Contact Us</button>
      </div>
    </main>
  );
} 