'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  MapIcon,
  BellIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import {
  Satellite,
  Activity,
  Shield,
  TrendingUp
} from 'lucide-react';
import FilterDrawer from '../components/FilterDrawer';
import AlertsModal from '../components/AlertsModal';
import ExportModal from '../components/ExportModal';
import MapErrorBoundary from '../components/MapErrorBoundary';
import { useVesselStore } from '../store/useVesselStore';
import { StatCard } from '../components/StatCard';
import { useLastUpdated } from '../hooks/useLastUpdated';
import { useRealTimeVessels } from '../hooks/useRealTimeVessels';
import { RefreshIndicator } from '../components/RefreshIndicator';
import VesselTable from '../components/VesselTable';
import { Vessel } from '../types';
import styles from './Dashboard.module.css';

const LeafletMapWrapper = dynamic(
  () => import('../components/LeafletMapWrapper'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <p className="text-white">Loading map...</p>
      </div>
    )
  }
);

export default function DashboardClient() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [showDetections, setShowDetections] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  // Use real-time vessel data
  const {
    vessels,
    lastUpdated,
    isLoading,
    isManualRefreshing,
    isDataStale,
    timeSinceLastUpdate,
    nextRefreshIn,
    refreshData
  } = useRealTimeVessels();
  
  const alerts = useVesselStore(state => state.alerts);
  const { lastUpdated: summaryLastUpdated, isLoading: isLastUpdatedLoading } = useLastUpdated();

  const activeVessels = vessels.filter(v => v.status === 'active').length;
  const darkVessels = vessels.filter(v => v.status === 'dark').length;
  const totalVessels = vessels.length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-black/50">
        <div className="max-w-[2000px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                IODarkWatch
              </h1>
              <p className="text-sm text-gray-400 hidden sm:block">Maritime Surveillance System</p>
            </div>

            <div className="flex items-center gap-3">
              <RefreshIndicator
                isRefreshing={isLoading}
                lastUpdated={lastUpdated}
                nextRefreshIn={nextRefreshIn}
                onManualRefresh={refreshData}
                isDataStale={isDataStale}
              />
              
              <button
                onClick={() => setShowDetections(!showDetections)}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/20 rounded-xl transition-all flex items-center gap-2 text-sm font-medium"
              >
                <MapIcon className="w-5 h-5 text-cyan-400" />
                <span className="hidden sm:inline">Recent Detections</span>
                <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {vessels.length}
                </span>
              </button>
              
              <button
                onClick={() => setFilterOpen(true)}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
                title="Filter"
              >
                <FunnelIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setAlertsOpen(true)}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all relative border border-white/10"
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
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
                title="Export"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Stats Bar */}
        <div className="border-b border-white/10 px-4 md:px-6 py-4 md:py-6 bg-black/50 backdrop-blur-xl">
          <div className="max-w-[2000px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Activity className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                  </div>
                  <p className="text-xs md:text-sm text-gray-400">Active Vessels</p>
                </div>
                <p className="text-2xl md:text-4xl font-bold text-green-400">{activeVessels}</p>
              </div>
              
              <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
                  </div>
                  <p className="text-xs md:text-sm text-gray-400">Dark Vessels</p>
                </div>
                <p className="text-2xl md:text-4xl font-bold text-red-400">{darkVessels}</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <BellIcon className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                  </div>
                  <p className="text-xs md:text-sm text-gray-400">Active Alerts</p>
                </div>
                <p className="text-2xl md:text-4xl font-bold text-yellow-400">{alerts.length}</p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                  </div>
                  <p className="text-xs md:text-sm text-gray-400">Last Update</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl md:text-4xl font-bold text-cyan-400">
                    {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </p>
                  {isLoading && (
                    <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map and Table Layout */}
        <div className="p-4 md:p-6">
          <div className="max-w-[2000px] mx-auto space-y-6">
            {/* Map Section */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Maritime Surveillance Map
                </h2>
                <div className="text-sm text-gray-400">
                  Live tracking · {vessels.length} vessels monitored
                </div>
              </div>
              <div className="relative h-[500px] md:h-[600px] bg-black/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
                <LeafletMapWrapper />
              </div>
            </div>

            {/* Vessel Table Section */}
            <div className="w-full">
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Vessel Information
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {vessels.length} vessels tracked
                      {timeSinceLastUpdate && (
                        <span className="ml-2 text-xs">
                          · Updated {timeSinceLastUpdate}s ago
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Satellite className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <VesselTable 
                  vessels={vessels} 
                  onVesselSelect={(vessel) => {
                    setSelectedVessel(vessel);
                  }}
                />
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