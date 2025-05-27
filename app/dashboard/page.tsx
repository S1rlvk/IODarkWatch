'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { IndustrialLayout } from '../components/IndustrialLayout';
import { MetricCard } from '../components/MetricCard';
import { TruckIcon, ExclamationTriangleIcon, BellIcon } from '@heroicons/react/24/outline';
import { Vessel, Alert } from '../types';

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-bg-primary text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-blue mx-auto mb-4"></div>
        <p className="text-lg">Loading map...</p>
      </div>
    </div>
  ),
});

// Mock data
const mockVessels: Vessel[] = [
  {
    id: '1',
    name: 'Ocean Voyager',
    type: 'Cargo',
    mmsi: '123456789',
    imo: 'IMO1234567',
    flag: 'Panama',
    position: { lat: 15.5, lng: 73.8 },
    speed: 12,
    course: 45,
    lastUpdate: new Date().toISOString(),
    riskLevel: 'low',
    region: 'Indian Ocean'
  }
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'Dark Ship',
    severity: 'high',
    description: 'Vessel detected with AIS turned off',
    timestamp: new Date().toISOString(),
    vessel: mockVessels[0]
  }
];

export default function Dashboard() {
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  return (
    <IndustrialLayout>
      <div className="flex h-full">
        {/* Main Map Area */}
        <div className="flex-1 h-full">
          <MapComponent
            vessels={mockVessels}
            alerts={mockAlerts}
            onVesselSelect={setSelectedVessel}
            selectedVessel={selectedVessel}
          />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-surface border-l border-border p-4 flex flex-col">
          {/* Metrics Section */}
          <div className="space-y-4 mb-6">
            <MetricCard
              title="Active Vessels"
              value="1,234"
              icon={<TruckIcon className="w-6 h-6" />}
              trend={{ value: 5, isPositive: true }}
            />
            <MetricCard
              title="Dark Vessels"
              value="12"
              icon={<ExclamationTriangleIcon className="w-6 h-6" />}
              trend={{ value: 2, isPositive: true }}
            />
            <MetricCard
              title="Active Alerts"
              value="5"
              icon={<BellIcon className="w-6 h-6" />}
              trend={{ value: 10, isPositive: false }}
            />
          </div>

          {/* Selected Vessel Details */}
          {selectedVessel && (
            <div className="bg-bg-primary rounded-sm p-4 border border-border">
              <h3 className="text-lg font-bold text-white mb-4">{selectedVessel.name}</h3>
              <div className="space-y-2">
                <p className="text-gray-300">Type: {selectedVessel.type}</p>
                <p className="text-gray-300">Speed: {selectedVessel.speed} knots</p>
                <p className="text-gray-300">Course: {selectedVessel.course}°</p>
                <p className="text-gray-300">Risk Level: {selectedVessel.riskLevel}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </IndustrialLayout>
  );
} 