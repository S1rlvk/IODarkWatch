'use client';

import { useState } from 'react';
import StatsCard from '../components/StatsCard';
import VesselMapClient from './VesselMapClient';
import FilterDrawer from '../components/FilterDrawer';
import AlertsModal from '../components/AlertsModal';
import ExportModal from '../components/ExportModal';
import { useVesselStore } from '../store/useVesselStore';

export default function DashboardClient() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const vessels = useVesselStore(state => state.vessels);
  const alerts = useVesselStore(state => state.alerts);
  const activeVessels = vessels.filter(v => v.status === 'active').length;
  const darkVessels = vessels.filter(v => v.status === 'dark').length;
  const totalVessels = vessels.length;

  // Calculate percentages
  const activePercentage = totalVessels > 0 ? (activeVessels / totalVessels * 100).toFixed(1) : '0.0';
  const darkPercentage = totalVessels > 0 ? (darkVessels / totalVessels * 100).toFixed(1) : '0.0';
  const alertPercentage = totalVessels > 0 ? (alerts.length / totalVessels * 100).toFixed(1) : '0.0';

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="max-w-8xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12 pb-8 border-b border-[#2a4365]">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
            Maritime Domain Awareness
          </h1>
          <p className="text-gray-300 text-xl">Real-time vessel tracking in the Indian Ocean</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#2d3748]/90 backdrop-blur-md border border-[#2d3748] rounded-2xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-200 text-base font-medium uppercase tracking-wider">Active Vessels</span>
              <i className="fas fa-ship text-blue-400 text-2xl"></i>
            </div>
            <div className="text-5xl font-bold text-white mb-3">{activeVessels}</div>
            <div className="flex items-center text-green-400 text-base">
              <i className="fas fa-arrow-up mr-2"></i>
              <span>{activePercentage}% of total vessels</span>
            </div>
          </div>

          <div className="bg-[#2d3748]/90 backdrop-blur-md border border-[#2d3748] rounded-2xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 to-red-600"></div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-200 text-base font-medium uppercase tracking-wider">Dark Vessels</span>
              <i className="fas fa-eye-slash text-red-400 text-2xl"></i>
            </div>
            <div className="text-5xl font-bold text-white mb-3">{darkVessels}</div>
            <div className="flex items-center text-red-400 text-base">
              <i className="fas fa-arrow-down mr-2"></i>
              <span>{darkPercentage}% of total vessels</span>
            </div>
          </div>

          <div className="bg-[#2d3748]/90 backdrop-blur-md border border-[#2d3748] rounded-2xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-200 text-base font-medium uppercase tracking-wider">Open Alerts</span>
              <i className="fas fa-exclamation-triangle text-yellow-400 text-2xl"></i>
            </div>
            <div className="text-5xl font-bold text-white mb-3">{alerts.length}</div>
            <div className="flex items-center text-yellow-400 text-base">
              <i className="fas fa-arrow-up mr-2"></i>
              <span>{alertPercentage}% of total vessels</span>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="bg-[#2d3748]/90 backdrop-blur-md border border-[#2d3748] rounded-2xl p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setFilterOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 text-lg"
            >
              <i className="fas fa-filter"></i>
              Filter Vessels
            </button>
            <button
              onClick={() => setAlertsOpen(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-red-500/20 hover:-translate-y-0.5 text-lg"
            >
              <i className="fas fa-bell"></i>
              View Alerts
            </button>
            <button
              onClick={() => setExportOpen(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-green-500/20 hover:-translate-y-0.5 text-lg"
            >
              <i className="fas fa-download"></i>
              Export Data
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-[#2d3748]/90 backdrop-blur-md border border-[#2d3748] rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold text-white">Live Vessel Tracking</h3>
            <div className="flex items-center gap-3 text-green-400 text-base">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
              <span>System Online</span>
            </div>
          </div>
          <div className="relative">
            <div className="h-[700px] rounded-xl overflow-hidden shadow-2xl">
              <VesselMapClient />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-[#2a4365]">
          <a
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 border-2 border-blue-400 text-blue-400 rounded-xl hover:bg-blue-400 hover:text-white transition-all duration-300 text-lg font-medium"
          >
            <i className="fas fa-envelope"></i>
            Contact Us
          </a>
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