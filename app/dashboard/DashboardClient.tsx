'use client';

import { useState } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MapIcon,
  TableCellsIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import StatsCard from '../components/StatsCard';
import VesselMapClient from './VesselMapClient';
import FilterDrawer from '../components/FilterDrawer';
import AlertsModal from '../components/AlertsModal';
import ExportModal from '../components/ExportModal';
import { useVesselStore } from '../store/useVesselStore';

export default function DashboardClient() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [lastUpdated] = useState(new Date().toLocaleString());

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
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0]">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-[#333] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#222] rounded-lg transition-colors duration-200 hover:shadow-lg hover:shadow-[#00FFFF]/10"
            >
              {sidebarOpen ? (
                <ChevronLeftIcon className="w-6 h-6" />
              ) : (
                <ChevronRightIcon className="w-6 h-6" />
              )}
            </button>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-[#00FFFF] to-[#39FF14] bg-clip-text text-transparent">IODarkWatch</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterOpen(true)}
              className="p-2 hover:bg-[#222] rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#00FFFF]/10 group"
              title="Filter"
            >
              <FunnelIcon className="w-5 h-5 group-hover:text-[#00FFFF]" />
            </button>
            <button
              onClick={() => setAlertsOpen(true)}
              className="p-2 hover:bg-[#222] rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#00FFFF]/10 group relative"
              title="Alerts"
            >
              <BellIcon className="w-5 h-5 group-hover:text-[#00FFFF]" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF5F5F] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {alerts.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setExportOpen(true)}
              className="p-2 hover:bg-[#222] rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#00FFFF]/10 group"
              title="Export Data"
            >
              <ArrowDownTrayIcon className="w-5 h-5 group-hover:text-[#00FFFF]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#333] hover:border-[#39FF14]/30 transition-colors duration-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#A0A0A0] font-medium">Active Vessels</span>
              <span className="text-[#39FF14] font-semibold">{activePercentage}%</span>
            </div>
            <div className="text-2xl font-bold text-[#E0E0E0]">{activeVessels}</div>
          </div>
          <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#333] hover:border-[#FF5F5F]/30 transition-colors duration-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#A0A0A0] font-medium">Dark Vessels</span>
              <span className="text-[#FF5F5F] font-semibold">{darkPercentage}%</span>
            </div>
            <div className="text-2xl font-bold text-[#E0E0E0]">{darkVessels}</div>
          </div>
          <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#333] hover:border-[#00FFFF]/30 transition-colors duration-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#A0A0A0] font-medium">Open Alerts</span>
              <span className="text-[#00FFFF] font-semibold">{alertPercentage}%</span>
            </div>
            <div className="text-2xl font-bold text-[#E0E0E0]">{alerts.length}</div>
          </div>
        </div>

        {/* Map and Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: 'calc(100vh - 14rem)' }}>
          {/* Map Area */}
          <div className="lg:col-span-2 bg-[#1A1A1A] rounded-lg border border-[#333] overflow-hidden hover:border-[#00FFFF]/30 transition-colors duration-200">
            <VesselMapClient />
          </div>

          {/* Detection List */}
          <div className="bg-[#1A1A1A] rounded-lg border border-[#333] overflow-hidden hover:border-[#00FFFF]/30 transition-colors duration-200">
            <div className="p-4 border-b border-[#333]">
              <h3 className="font-semibold text-[#E0E0E0]">Recent Detections</h3>
            </div>
            <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-[#1A1A1A]" style={{ height: 'calc(100% - 3.5rem)' }}>
              {vessels.map(vessel => (
                <div key={vessel.id} className="p-4 border-b border-[#333] hover:bg-[#222] transition-colors duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-[#E0E0E0]">{vessel.name}</h4>
                      <p className="text-sm text-[#A0A0A0]">
                        {vessel.timestamp ? new Date(vessel.timestamp).toLocaleString() : 'No timestamp'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      vessel.status === 'dark' ? 'bg-[#FF5F5F]/20 text-[#FF5F5F]' :
                      vessel.status === 'active' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                      'bg-[#00FFFF]/20 text-[#00FFFF]'
                    }`}>
                      {vessel.status}
                    </span>
                  </div>
                  <div className="text-sm text-[#A0A0A0] space-y-1">
                    <p>Lat: {vessel.location.lat.toFixed(4)}</p>
                    <p>Lon: {vessel.location.lng.toFixed(4)}</p>
                    <p>Confidence: {((vessel.confidence || 0) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <FilterDrawer isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
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
          console.log(`Exporting as ${format}, onlyFlagged: ${onlyFlagged}`);
          setExportOpen(false);
        }}
        totalRecords={vessels.length}
      />
    </div>
  );
}