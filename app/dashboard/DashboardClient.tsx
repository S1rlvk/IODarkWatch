'use client';

import { useState } from 'react';
import { 
  MapIcon,
  BellIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import VesselMapClient from './VesselMapClient';
import FilterDrawer from '../components/FilterDrawer';
import AlertsModal from '../components/AlertsModal';
import ExportModal from '../components/ExportModal';
import { useVesselStore } from '../store/useVesselStore';
import { StatCard } from '../components/StatCard';
import { useLastUpdated } from '../hooks/useLastUpdated';
import VesselTable from '../components/VesselTable';
import { Vessel } from '../types';

export default function DashboardClient() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [showDetections, setShowDetections] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  const vessels = useVesselStore(state => state.vessels);
  const alerts = useVesselStore(state => state.alerts);
  const { lastUpdated, isLoading: isLastUpdatedLoading } = useLastUpdated();

  const activeVessels = vessels.filter(v => v.status === 'active').length;
  const darkVessels = vessels.filter(v => v.status === 'dark').length;
  const totalVessels = vessels.length;

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-[2000px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">IODarkWatch</h1>
              <p className="text-sm text-gray-400">Maritime Surveillance System</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDetections(!showDetections)}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 text-sm font-medium"
              >
                <MapIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Recent Detections</span>
                <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {vessels.length}
                </span>
              </button>
              
              <button
                onClick={() => setFilterOpen(true)}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                title="Filter"
              >
                <FunnelIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setAlertsOpen(true)}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all relative"
                title="Alerts"
              >
                <BellIcon className="w-5 h-5" />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                    {alerts.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setExportOpen(true)}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                title="Export"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Stats Bar */}
        <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-cyan-400">{activeVessels}</p>
              <p className="text-sm text-gray-400 mt-1">Active Vessels</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400">{darkVessels}</p>
              <p className="text-sm text-gray-400 mt-1">Dark Vessels</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400">{alerts.length}</p>
              <p className="text-sm text-gray-400 mt-1">Active Alerts</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">
                {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </p>
              <p className="text-sm text-gray-400 mt-1">Last Update</p>
            </div>
          </div>
        </div>

        {/* Map and Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Map Container */}
          <div className="relative h-[calc(100vh-280px)] rounded-xl overflow-hidden border border-white/10">
            {isLastUpdatedLoading && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-40">
                <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                <p className="text-xl font-medium text-white">Loading map data...</p>
                <p className="text-gray-400 mt-2">Fetching latest vessel information</p>
              </div>
            )}
            <VesselMapClient />
          </div>

          {/* Vessel Table */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Vessel Information</h2>
                <p className="text-sm text-gray-400 mt-1">{vessels.length} vessels tracked</p>
              </div>
            </div>
            <VesselTable 
              vessels={vessels} 
              onVesselSelect={(vessel) => {
                setSelectedVessel(vessel);
                // You can add additional logic here to highlight the vessel on the map
              }}
            />
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