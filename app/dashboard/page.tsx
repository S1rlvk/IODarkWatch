'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { sampleVessels, sampleAlerts } from '../data/sampleVessels';
import FilterModal from '../components/FilterModal';
import AlertsModal from '../components/AlertsModal';
import ExportModal from '../components/ExportModal';

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import('../components/MapComponent').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-[#111] text-white">
      Loading map...
    </div>
  )
});

export default function Dashboard() {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    regions: [],
    onlyDarkShips: false,
    confidenceScore: 0.5
  });

  const activeVessels = sampleVessels.filter(v => v.status === 'active').length;
  const darkVessels = sampleVessels.filter(v => v.status === 'dark').length;
  const totalAlerts = sampleAlerts.length;

  const handleFilterApply = (newFilters: any) => {
    setFilters(newFilters);
    // Here you would typically filter the vessels based on the new filters
    // For now, we're just storing the filters
  };

  const handleAlertSelect = (alert: any) => {
    setSelectedAlert(alert);
    setIsAlertsModalOpen(false);
    // Here you would typically zoom the map to the alert location
  };

  const handleExport = (format: string, onlyFlagged: boolean) => {
    // Here you would implement the actual export functionality
    console.log(`Exporting as ${format}, onlyFlagged: ${onlyFlagged}`);
    setIsExportModalOpen(false);
  };

  return (
    <div className="min-h-screen w-screen bg-[#111] text-white fixed top-0 left-0 overflow-y-auto">
      <div className="p-5 max-w-7xl mx-auto">
        <h1 className="text-2xl mb-2.5 text-white">Maritime Domain Awareness</h1>
        <p className="mb-5 text-gray-300">Real-time vessel tracking in the Indian Ocean</p>

        <div className="mb-5">
          <h3 className="mb-1.5 text-white">Active Vessels</h3>
          <p className="mb-4 text-gray-300">{activeVessels}</p>

          <h3 className="mb-1.5 text-white">Dark Vessels</h3>
          <p className="mb-4 text-gray-300">{darkVessels}</p>

          <h3 className="mb-1.5 text-white">Alerts</h3>
          <p className="mb-4 text-gray-300">{totalAlerts}</p>
        </div>

        <div className="mb-5 space-x-2.5">
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="px-4 py-2 bg-[#333] text-white rounded hover:bg-[#444] transition-colors"
          >
            Filter Vessels
          </button>
          <button 
            onClick={() => setIsAlertsModalOpen(true)}
            className="px-4 py-2 bg-[#333] text-white rounded hover:bg-[#444] transition-colors"
          >
            View Alerts
          </button>
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 bg-[#333] text-white rounded hover:bg-[#444] transition-colors"
          >
            Export Data
          </button>
        </div>

        <div className="h-[600px] w-full bg-[#111] rounded-lg overflow-hidden">
          <MapComponent
            alerts={sampleAlerts}
            onAlertClick={setSelectedAlert}
            selectedAlert={selectedAlert}
          />
        </div>

        <div className="text-center mt-5 py-5">
          <button className="px-4 py-2 bg-[#333] text-white rounded hover:bg-[#444] transition-colors min-w-[120px]">
            Contact Us
          </button>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleFilterApply}
      />

      <AlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        alerts={sampleAlerts}
        onAlertSelect={handleAlertSelect}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        totalRecords={sampleVessels.length}
      />
    </div>
  );
} 