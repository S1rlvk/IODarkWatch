'use client';

import { useState } from 'react';
import StatsCard from '../components/StatsCard';
import VesselMapClient from './VesselMapClient';
import FilterDrawer from '../components/FilterDrawer';
import AlertsModal from '../components/AlertsModal';
import ExportModal from '../components/ExportModal';
import { useVesselStore } from '../store/useVesselStore';

export default function Dashboard() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const vessels = useVesselStore(state => state.vessels);
  const alerts = useVesselStore(state => state.alerts);
  const activeVessels = vessels.filter(v => v.status === 'active').length;
  const darkVessels = vessels.filter(v => v.status === 'dark').length;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="border-b border-[#1a1a1a] pb-6">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Maritime Domain Awareness
          </h1>
          <p className="text-gray-400 text-lg">Real-time vessel tracking in the Indian Ocean</p>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard 
            title="Active Vessels" 
            count={activeVessels} 
            trend={5.2}
            className="bg-[#1a1a1a] border border-[#333]"
          />
          <StatsCard 
            title="Dark Vessels" 
            count={darkVessels} 
            trend={-2.1}
            className="bg-[#1a1a1a] border border-[#333]"
          />
          <StatsCard 
            title="Open Alerts" 
            count={alerts.length} 
            trend={8.4}
            className="bg-[#1a1a1a] border border-[#333]"
          />
        </section>

        {/* Action buttons */}
        <section className="flex flex-wrap gap-4">
          <button
            onClick={() => setFilterOpen(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter Vessels
          </button>
          <button
            onClick={() => setAlertsOpen(true)}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 shadow-lg shadow-red-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            View Alerts
          </button>
          <button
            onClick={() => setExportOpen(true)}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-lg shadow-green-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export Data
          </button>
        </section>

        {/* Map */}
        <div className="h-[600px] rounded-2xl shadow-lg border border-[#333] overflow-hidden bg-[#0a0a0a]">
          <VesselMapClient />
        </div>
      </div>

      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
      />

      <AlertsModal
        isOpen={alertsOpen}
        onClose={() => setAlertsOpen(false)}
        alerts={alerts}
        onAlertSelect={(alert) => {
          useVesselStore.getState().setSelectedAlert(alert);
          setAlertsOpen(false);
        }}
      />

      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        onExport={(format, onlyFlagged) => {
          // TODO: Implement export functionality
          console.log(`Exporting as ${format}, onlyFlagged: ${onlyFlagged}`);
          setExportOpen(false);
        }}
        totalRecords={vessels.length}
      />
    </main>
  );
} 