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

export default function DashboardClient() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [showDetections, setShowDetections] = useState(false);

  const vessels = useVesselStore(state => state.vessels);
  const alerts = useVesselStore(state => state.alerts);
  const { lastUpdated, isLoading: isLastUpdatedLoading } = useLastUpdated();

  const activeVessels = vessels.filter(v => v.status === 'active').length;
  const darkVessels = vessels.filter(v => v.status === 'dark').length;
  const totalVessels = vessels.length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Streamlined Header */}
      <header className="bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <span className="text-white font-black text-xl">IO</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">IODarkWatch</h1>
                  <p className="text-sm text-gray-400">Maritime Surveillance System</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
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

        {/* Map Container */}
        <div className="relative h-[calc(100vh-180px)]">
          {isLastUpdatedLoading && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-40">
              <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
              <p className="text-xl font-medium text-white">Loading map data...</p>
              <p className="text-gray-400 mt-2">Fetching latest vessel information</p>
            </div>
          )}
          <VesselMapClient />
        </div>

        {/* Slide-out Detection Panel */}
        <div className={`fixed right-0 top-0 h-full bg-black/95 backdrop-blur-xl border-l border-white/10 transition-transform duration-300 z-40 ${
          showDetections ? 'translate-x-0' : 'translate-x-full'
        }`} style={{ width: '400px' }}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Recent Detections</h2>
                <p className="text-sm text-gray-400 mt-1">{vessels.length} vessels tracked</p>
              </div>
              <button
                onClick={() => setShowDetections(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {vessels.map(vessel => (
                <div key={vessel.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{vessel.name}</h3>
                      <p className="text-sm text-gray-400">
                        {vessel.timestamp ? new Date(vessel.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      vessel.status === 'dark' ? 'bg-red-500/20 text-red-400' :
                      vessel.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {vessel.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Position</p>
                      <p className="text-sm font-medium">
                        {vessel.location.lat.toFixed(3)}°, {vessel.location.lng.toFixed(3)}°
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              (vessel.confidence || 0) > 0.7 ? 'bg-red-500' :
                              (vessel.confidence || 0) > 0.4 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${(vessel.confidence || 0) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{((vessel.confidence || 0) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
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