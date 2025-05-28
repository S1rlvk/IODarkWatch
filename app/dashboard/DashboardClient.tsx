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
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b border-[#2a4365]">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Maritime Domain Awareness
          </h1>
          <p className="text-gray-400 text-lg">Real-time vessel tracking in the Indian Ocean</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#2d3748]/80 backdrop-blur-sm border border-[#2d3748] rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300 text-sm font-medium uppercase tracking-wider">Active Vessels</span>
              <i className="fas fa-ship text-blue-400 text-xl"></i>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{activeVessels}</div>
            <div className="flex items-center text-green-400 text-sm">
              <i className="fas fa-arrow-up mr-1"></i>
              <span>{activePercentage}%</span>
            </div>
          </div>

          <div className="bg-[#2d3748]/80 backdrop-blur-sm border border-[#2d3748] rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600"></div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300 text-sm font-medium uppercase tracking-wider">Dark Vessels</span>
              <i className="fas fa-eye-slash text-red-400 text-xl"></i>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{darkVessels}</div>
            <div className="flex items-center text-red-400 text-sm">
              <i className="fas fa-arrow-down mr-1"></i>
              <span>{darkPercentage}%</span>
            </div>
          </div>

          <div className="bg-[#2d3748]/80 backdrop-blur-sm border border-[#2d3748] rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300 text-sm font-medium uppercase tracking-wider">Open Alerts</span>
              <i className="fas fa-exclamation-triangle text-yellow-400 text-xl"></i>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{alerts.length}</div>
            <div className="flex items-center text-yellow-400 text-sm">
              <i className="fas fa-arrow-up mr-1"></i>
              <span>{alertPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="bg-[#2d3748]/80 backdrop-blur-sm border border-[#2d3748] rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setFilterOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
            >
              <i className="fas fa-filter"></i>
              Filter Vessels
            </button>
            <button
              onClick={() => setAlertsOpen(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 hover:-translate-y-0.5"
            >
              <i className="fas fa-bell"></i>
              View Alerts
            </button>
            <button
              onClick={() => setExportOpen(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:-translate-y-0.5"
            >
              <i className="fas fa-download"></i>
              Export Data
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-[#2d3748]/80 backdrop-blur-sm border border-[#2d3748] rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Live Vessel Tracking</h3>
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <div className="status-dot"></div>
              <span>System Online</span>
            </div>
          </div>
          <div className="relative">
            <div className="h-[600px] rounded-lg overflow-hidden">
              <VesselMapClient />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-[#2a4365]">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 border border-blue-400 text-blue-400 rounded-lg hover:bg-blue-400 hover:text-white transition-all duration-300"
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