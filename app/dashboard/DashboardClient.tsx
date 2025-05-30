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
import VesselMapClient from './VesselMapClient';
import FilterDrawer from '../components/FilterDrawer';
import AlertsModal from '../components/AlertsModal';
import ExportModal from '../components/ExportModal';
import { useVesselStore } from '../store/useVesselStore';
import { StatCard } from '../components/StatCard';
import { useLastUpdated } from '../hooks/useLastUpdated';

export default function DashboardClient() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const vessels = useVesselStore(state => state.vessels);
  const alerts = useVesselStore(state => state.alerts);
  const { lastUpdated, isLoading: isLastUpdatedLoading } = useLastUpdated();

  const activeVessels = vessels.filter(v => v.status === 'active').length;
  const darkVessels = vessels.filter(v => v.status === 'dark').length;
  const totalVessels = vessels.length;

  // Calculate percentages
  const activePercentage = totalVessels > 0 ? (activeVessels / totalVessels * 100).toFixed(1) : '0.0';
  const darkPercentage = totalVessels > 0 ? (darkVessels / totalVessels * 100).toFixed(1) : '0.0';
  const alertPercentage = totalVessels > 0 ? (alerts.length / totalVessels * 100).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-[#101723] text-[15px] text-white font-inter">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen bg-[#111111] border-r border-[#222] transition-all duration-200 z-50 ${
        sidebarOpen ? 'w-[280px] md:w-[220px]' : 'w-[60px]'
      }`}>
        <div className="p-4 flex flex-col h-full">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors duration-200 hover:shadow-lg hover:shadow-[#00FFFF]/10 text-white w-10 h-10 flex items-center justify-center"
          >
            {sidebarOpen ? (
              <ChevronLeftIcon className="w-6 h-6" />
            ) : (
              <ChevronRightIcon className="w-6 h-6" />
            )}
          </button>
          <nav className="mt-8 space-y-2">
            <button className="w-full p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors duration-200 text-white flex items-center gap-3 h-11">
              <MapIcon className="w-6 h-6" />
              {sidebarOpen && <span className="text-sm">Dashboard</span>}
            </button>
            <button className="w-full p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors duration-200 text-white flex items-center gap-3 h-11">
              <BellIcon className="w-6 h-6" />
              {sidebarOpen && <span className="text-sm">Alerts</span>}
            </button>
            <button className="w-full p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors duration-200 text-white flex items-center gap-3 h-11">
              <ChartBarIcon className="w-6 h-6" />
              {sidebarOpen && <span className="text-sm">Analytics</span>}
            </button>
            <button className="w-full p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors duration-200 text-white flex items-center gap-3 h-11">
              <Cog6ToothIcon className="w-6 h-6" />
              {sidebarOpen && <span className="text-sm">Settings</span>}
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-200 ${sidebarOpen ? 'ml-[280px] md:ml-[220px]' : 'ml-[60px]'}`}>
        {/* Header */}
        <header className="bg-[#111111] border-b border-[#222] p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00FFFF] to-[#39FF14] flex items-center justify-center">
                <span className="text-black font-bold text-lg">IO</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#39FF14] bg-clip-text text-transparent tracking-tight">
                IODarkWatch
              </h1>
              <span className="hidden md:inline text-xs text-white/40 px-2 py-1 rounded-full border border-white/10">v1.0</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setFilterOpen(true)}
                className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#00FFFF]/10 group text-white w-9 h-9 md:w-11 md:h-11 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00FFFF]"
                title="Filter"
              >
                <FunnelIcon className="w-4 h-4 md:w-5 md:h-5 group-hover:text-[#00FFFF]" />
              </button>
              <button
                onClick={() => setAlertsOpen(true)}
                className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#00FFFF]/10 group relative text-white w-9 h-9 md:w-11 md:h-11 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00FFFF]"
                title="Alerts"
              >
                <BellIcon className="w-4 h-4 md:w-5 md:h-5 group-hover:text-[#00FFFF]" />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF5F5F] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                    {alerts.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setExportOpen(true)}
                className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#00FFFF]/10 group text-white w-9 h-9 md:w-11 md:h-11 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00FFFF]"
                title="Export Data"
              >
                <ArrowDownTrayIcon className="w-4 h-4 md:w-5 md:h-5 group-hover:text-[#00FFFF]" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <StatCard
              title="Active Vessels"
              value={activeVessels}
              percentage={activePercentage}
              type="active"
              isLoading={isLastUpdatedLoading}
            />
            <StatCard
              title="Dark Vessels"
              value={darkVessels}
              percentage={darkPercentage}
              type="dark"
              isLoading={isLastUpdatedLoading}
            />
            <StatCard
              title="Open Alerts"
              value={alerts.length}
              percentage={alertPercentage}
              type="alert"
              isLoading={isLastUpdatedLoading}
            />
            <StatCard
              title="Last Sync"
              value={lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '--:--:--'}
              type="sync"
              isLoading={isLastUpdatedLoading}
            />
          </div>

          {/* Map and Table Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: 'calc(100vh - 14rem)' }}>
            {/* Map Area */}
            <div className="lg:col-span-2 bg-[#111111] rounded-lg border border-[#222] overflow-hidden hover:border-[#00FFFF]/30 transition-colors duration-200 relative">
              {isLastUpdatedLoading ? (
                <div className="absolute inset-0 bg-[#111111]/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                  <div className="w-12 h-12 border-4 border-[#00FFFF]/20 border-t-[#00FFFF] rounded-full animate-spin mb-4"></div>
                  <p className="text-white/80 font-medium">Loading map data...</p>
                  <p className="text-white/40 text-sm mt-1">Please wait while we fetch the latest vessel information</p>
                </div>
              ) : null}
              <VesselMapClient />
            </div>

            {/* Detection List */}
            <div className="bg-[#111111] rounded-lg border border-[#222] overflow-hidden hover:border-[#00FFFF]/30 transition-colors duration-200">
              <div className="p-4 border-b border-[#222] flex items-center justify-between">
                <h3 className="font-semibold text-white text-lg">Recent Detections</h3>
                <span className="text-sm text-white/60">{vessels.length} vessels</span>
              </div>
              <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-[#222] scrollbar-track-[#111111] p-4 space-y-4" style={{ height: 'calc(100% - 3.5rem)' }}>
                {vessels.map(vessel => (
                  <div key={vessel.id} className="bg-[#1A1A1A] rounded-lg p-4 hover:bg-[#222] transition-all duration-200 border border-[#222] hover:border-[#00FFFF]/20">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-white text-lg mb-1">{vessel.name}</h4>
                        <p className="text-sm text-white/60">
                          {vessel.timestamp ? new Date(vessel.timestamp).toLocaleString() : 'No timestamp'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        vessel.status === 'dark' ? 'bg-red-500/20 text-red-400' :
                        vessel.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {vessel.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-[#222] rounded-lg p-2">
                        <p className="text-white/40 text-xs mb-1">Latitude</p>
                        <p className="text-white font-medium">{vessel.location.lat.toFixed(4)}°</p>
                      </div>
                      <div className="bg-[#222] rounded-lg p-2">
                        <p className="text-white/40 text-xs mb-1">Longitude</p>
                        <p className="text-white font-medium">{vessel.location.lng.toFixed(4)}°</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <p className="text-white/40 text-xs">Confidence</p>
                        <p className="text-white font-medium">{((vessel.confidence || 0) * 100).toFixed(1)}%</p>
                      </div>
                      <div className="w-full h-1.5 bg-[#222] rounded-full mt-1">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[#00FFFF] to-[#39FF14]"
                          style={{ width: `${(vessel.confidence || 0) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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