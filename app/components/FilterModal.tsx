'use client';

import React, { useState } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

const regions = [
  'Arabian Sea',
  'Bay of Bengal',
  'Indian Ocean',
  'Laccadive Sea',
  'Andaman Sea'
];

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = useState({
    dateRange: {
      start: '',
      end: ''
    },
    regions: [] as string[],
    onlyDarkShips: false,
    confidenceScore: 0.5
  });

  if (!isOpen) return null;

  const handleRegionChange = (region: string) => {
    setFilters(prev => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region]
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="w-96 h-full bg-[#1a1a1a] p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Filter Vessels</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date Range
            </label>
            <div className="space-y-2">
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
                className="w-full bg-[#333] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
                className="w-full bg-[#333] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Region Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Regions
            </label>
            <div className="space-y-2">
              {regions.map(region => (
                <label key={region} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.regions.includes(region)}
                    onChange={() => handleRegionChange(region)}
                    className="rounded bg-[#333] border-gray-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-300">{region}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dark Ships Toggle */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.onlyDarkShips}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  onlyDarkShips: e.target.checked
                }))}
                className="rounded bg-[#333] border-gray-600 focus:ring-blue-500"
              />
              <span className="text-gray-300">Only dark ships (no AIS match)</span>
            </label>
          </div>

          {/* Confidence Score Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confidence Score: {filters.confidenceScore}
            </label>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.1"
              value={filters.confidenceScore}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                confidenceScore: parseFloat(e.target.value)
              }))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal; 