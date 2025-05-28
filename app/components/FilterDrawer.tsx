'use client';

import React, { useState } from 'react';
import { useVesselStore } from '../store/useVesselStore';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ isOpen, onClose }) => {
  const { filters, setFilters } = useVesselStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[#111] border-l border-[#333] p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Filter Vessels</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      {/* Status Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Status</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.status.includes('active')}
              onChange={(e) => {
                const newStatus = e.target.checked
                  ? [...filters.status, 'active']
                  : filters.status.filter(s => s !== 'active');
                setFilters({ status: newStatus });
              }}
              className="mr-2"
            />
            Active
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.status.includes('dark')}
              onChange={(e) => {
                const newStatus = e.target.checked
                  ? [...filters.status, 'dark']
                  : filters.status.filter(s => s !== 'dark');
                setFilters({ status: newStatus });
              }}
              className="mr-2"
            />
            Dark
          </label>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Date Range</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-1">Start Date</label>
            <input
              type="date"
              value={filters.dateRange[0]?.toISOString().split('T')[0] || ''}
              onChange={(e) => {
                const startDate = e.target.value ? new Date(e.target.value) : null;
                setFilters({
                  dateRange: [startDate, filters.dateRange[1]]
                });
              }}
              className="w-full p-2 bg-[#222] border border-[#333] rounded"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">End Date</label>
            <input
              type="date"
              value={filters.dateRange[1]?.toISOString().split('T')[0] || ''}
              onChange={(e) => {
                const endDate = e.target.value ? new Date(e.target.value) : null;
                setFilters({
                  dateRange: [filters.dateRange[0], endDate]
                });
              }}
              className="w-full p-2 bg-[#222] border border-[#333] rounded"
            />
          </div>
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Vessel Type</label>
        <div className="space-y-2">
          {['Cargo', 'Tanker', 'Fishing'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.type.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...filters.type, type]
                    : filters.type.filter(t => t !== type);
                  setFilters({ type: newTypes });
                }}
                className="mr-2"
              />
              {type}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer; 