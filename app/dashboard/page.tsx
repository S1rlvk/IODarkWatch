'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { IndustrialLayout } from '../components/IndustrialLayout';
import { MetricCard } from '../components/MetricCard';
import { Vessel, Alert } from '../types';
import { 
  TruckIcon, 
  ExclamationTriangleIcon, 
  BellIcon 
} from '@heroicons/react/24/outline';

// Dynamically import the MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-surface">
      <div className="text-accent-blue animate-pulse">Loading map...</div>
    </div>
  ),
});

export default function Dashboard() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  const handleVesselSelect = (vessel: Vessel) => {
    setSelectedVessel(vessel);
  };

  return (
    <IndustrialLayout>
      <div className="h-full flex">
        {/* Main Map Area */}
        <div className="flex-1 relative">
          <MapComponent 
            vessels={vessels}
            alerts={alerts}
            onVesselSelect={handleVesselSelect}
            selectedVessel={selectedVessel}
          />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-surface border-l border-border p-4 flex flex-col gap-4">
          <div className="space-y-4">
            <MetricCard
              title="Active Vessels"
              value={vessels.length}
              icon={<TruckIcon className="w-6 h-6" />}
              trend={{ value: 5, isPositive: true }}
            />
            <MetricCard
              title="Dark Vessels"
              value={vessels.filter(v => v.riskLevel === 'high').length}
              icon={<ExclamationTriangleIcon className="w-6 h-6" />}
              trend={{ value: 2, isPositive: false }}
            />
            <MetricCard
              title="Active Alerts"
              value={alerts.length}
              icon={<BellIcon className="w-6 h-6" />}
            />
          </div>

          {/* Vessel Details */}
          {selectedVessel && (
            <div className="bg-surface border border-border rounded-sm p-4 mt-4">
              <h3 className="font-heading text-lg font-bold text-white mb-4">
                Vessel Details
              </h3>
              <div className="space-y-2 font-body text-sm">
                <p><span className="text-gray-400">Name:</span> {selectedVessel.name}</p>
                <p><span className="text-gray-400">Type:</span> {selectedVessel.type}</p>
                <p><span className="text-gray-400">Speed:</span> {selectedVessel.speed} knots</p>
                <p><span className="text-gray-400">Course:</span> {selectedVessel.course}°</p>
                <p><span className="text-gray-400">Risk Level:</span> {selectedVessel.riskLevel}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </IndustrialLayout>
  );
} 