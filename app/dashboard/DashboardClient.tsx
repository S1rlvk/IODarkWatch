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
    <div className="flex flex-col h-screen bg-[#121212] text-[#E0E0E0]">
      {/* Collapsible Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-[#1A1A1A] transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-[#333]">
          {sidebarOpen && <h2 className="text-lg font-semibold">Filters</h2>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-[#222] rounded"
          >
            {sidebarOpen ? <ChevronLeftIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
          </button>
        </div>
        
        {sidebarOpen && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <input type="date" className="w-full bg-[#222] border border-[#333] rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confidence Score</label>
              <input type="range" min="0" max="100" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Area of Interest</label>
              <select className="w-full bg-[#222] border border-[#333] rounded p-2">
                <option>Indian Ocean</option>
                <option>Arabian Sea</option>
                <option>Bay of Bengal</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top Header */}
        <div className="h-14 bg-[#1A1A1A] border-b border-[#333] flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">IODarkWatch</h1>
            <span className="text-sm text-[#A0A0A0]">· Open Maritime OSINT</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-[#A0A0A0]">
              <ClockIcon className="w-4 h-4 mr-1" />
              Last Updated: {lastUpdated}
            </div>
            <button 
              onClick={() => setFilterOpen(true)}
              className="p-2 hover:bg-[#222] rounded"
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setAlertsOpen(true)}
              className="p-2 hover:bg-[#222] rounded"
            >
              <BellIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setExportOpen(true)}
              className="p-2 hover:bg-[#222] rounded"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#333]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#A0A0A0]">Active Vessels</span>
              <span className="text-[#00FFFF]">{activePercentage}%</span>
            </div>
            <div className="text-2xl font-bold">{activeVessels}</div>
          </div>
          <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#333]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#A0A0A0]">Dark Vessels</span>
              <span className="text-[#FF5F5F]">{darkPercentage}%</span>
            </div>
            <div className="text-2xl font-bold">{darkVessels}</div>
          </div>
          <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#333]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#A0A0A0]">Open Alerts</span>
              <span className="text-[#39FF14]">{alertPercentage}%</span>
            </div>
            <div className="text-2xl font-bold">{alerts.length}</div>
          </div>
        </div>

        {/* Map and Table Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden" style={{ height: 'calc(100vh - 14rem)' }}>
          {/* Map Area */}
          <div className="lg:col-span-2 bg-[#1A1A1A] rounded-lg border border-[#333] overflow-hidden" style={{ height: '100%' }}>
            <div className="h-full w-full">
              <VesselMapClient />
            </div>
          </div>

          {/* Detection List */}
          <div className="bg-[#1A1A1A] rounded-lg border border-[#333] overflow-hidden h-full">
            <div className="p-4 border-b border-[#333]">
              <h3 className="font-semibold">Recent Detections</h3>
            </div>
            <div className="overflow-y-auto h-full">
              {vessels.map(vessel => (
                <div key={vessel.id} className="p-4 border-b border-[#333] hover:bg-[#222]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{vessel.name}</h4>
                      <p className="text-sm text-[#A0A0A0]">
                        {vessel.timestamp ? new Date(vessel.timestamp).toLocaleString() : 'No timestamp'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      vessel.status === 'dark' ? 'bg-[#FF5F5F]/20 text-[#FF5F5F]' :
                      vessel.status === 'active' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                      'bg-[#00FFFF]/20 text-[#00FFFF]'
                    }`}>
                      {vessel.status}
                    </span>
                  </div>
                  <div className="text-sm text-[#A0A0A0]">
                    <p>Lat: {vessel.location.lat.toFixed(4)}</p>
                    <p>Lon: {vessel.location.lng.toFixed(4)}</p>
                    <p>Confidence: {((vessel.confidence || 0) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <button className="px-2 py-1 text-xs bg-[#222] rounded hover:bg-[#333]">
                      Flag
                    </button>
                    <button className="px-2 py-1 text-xs bg-[#222] rounded hover:bg-[#333]">
                      Export
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
          console.log(`Exporting as ${format}, onlyFlagged: ${onlyFlagged}`);
          setExportOpen(false);
        }}
        totalRecords={vessels.length}
      />
    </div>
  );
}