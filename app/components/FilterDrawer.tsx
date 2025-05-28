import React from 'react';
import { useVesselStore } from '../store/useVesselStore';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const filters = useVesselStore(state => state.filters);
  const setFilters = useVesselStore(state => state.setFilters);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[#1a1a1a] border-l border-[#333] p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Filter Vessels</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters({
                dateRange: { ...filters.dateRange, start: e.target.value }
              })}
              className="w-full px-3 py-2 bg-[#333] text-white rounded border border-[#444] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters({
                dateRange: { ...filters.dateRange, end: e.target.value }
              })}
              className="w-full px-3 py-2 bg-[#333] text-white rounded border border-[#444] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Regions
          </label>
          <select
            multiple
            value={filters.regions}
            onChange={(e) => setFilters({
              regions: Array.from(e.target.selectedOptions, option => option.value)
            })}
            className="w-full px-3 py-2 bg-[#333] text-white rounded border border-[#444] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="north">North Indian Ocean</option>
            <option value="south">South Indian Ocean</option>
            <option value="east">East Indian Ocean</option>
            <option value="west">West Indian Ocean</option>
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.onlyDarkShips}
              onChange={(e) => setFilters({ onlyDarkShips: e.target.checked })}
              className="w-4 h-4 text-blue-500 border-gray-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-400">
              Only show dark ships
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Minimum Confidence Score: {(filters.confidenceScore * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.1"
            value={filters.confidenceScore}
            onChange={(e) => setFilters({
              confidenceScore: parseFloat(e.target.value)
            })}
            className="w-full h-2 bg-[#333] rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
} 