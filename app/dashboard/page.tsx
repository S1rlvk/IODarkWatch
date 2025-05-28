'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import StatsCard from '../components/StatsCard';
import FilterDrawer from '../components/FilterDrawer';
import AlertsModal from '../components/AlertsModal';
import ExportModal from '../components/ExportModal';
import { useVesselStore } from '../store/useVesselStore';

// Dynamically import VesselMap to avoid SSR issues
const VesselMap = dynamic(() => import('../components/VesselMap').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-[#111] text-white rounded-lg">
      Loading map...
    </div>
  )
});

export default function Dashboard() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const vessels = useVesselStore(state => state.vessels);
  const alerts = useVesselStore(state => state.alerts);
  const activeVessels = vessels.filter(v => v.status === 'active').length;
  const darkVessels = vessels.filter(v => v.status === 'dark').length;

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Maritime Domain Awareness</h1>
          <p className="text-gray-400">Real-time vessel tracking in the Indian Ocean</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatsCard
            title="Active Vessels"
            count={activeVessels}
            trend={5.2}
          />
          <StatsCard
            title="Dark Vessels"
            count={darkVessels}
            trend={-2.1}
          />
          <StatsCard
            title="Open Alerts"
            count={alerts.length}
            trend={8.4}
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="px-4 py-2 bg-[#333] text-white rounded hover:bg-[#444] transition-colors"
          >
            Filter Vessels
          </button>
          <button
            onClick={() => setIsAlertsOpen(true)}
            className="px-4 py-2 bg-[#333] text-white rounded hover:bg-[#444] transition-colors"
          >
            View Alerts
          </button>
          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 bg-[#333] text-white rounded hover:bg-[#444] transition-colors"
          >
            Export Data
          </button>
        </div>

        <VesselMap className="flex-1 rounded-2xl shadow-lg" />

        <div className="text-center py-6">
          <button className="px-4 py-2 bg-[#333] text-white rounded hover:bg-[#444] transition-colors min-w-[120px]">
            Contact Us
          </button>
        </div>
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <AlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onAlertSelect={(alert) => {
          useVesselStore.getState().setSelectedAlert(alert);
          setIsAlertsOpen(false);
        }}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={(format, onlyFlagged) => {
          // TODO: Implement export functionality
          console.log(`Exporting as ${format}, onlyFlagged: ${onlyFlagged}`);
          setIsExportOpen(false);
        }}
        totalRecords={vessels.length}
      />
    </div>
  );
} 