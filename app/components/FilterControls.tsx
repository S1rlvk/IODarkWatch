import React, { useState } from 'react';
import styles from './FilterControls.module.css';

interface FilterControlsProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  vesselType: string;
  status: string;
  timeRange: string;
}

const FilterControls: React.FC<FilterControlsProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    vesselType: 'all',
    status: 'all',
    timeRange: '24h',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className={styles.filterControls}>
      <div className={styles.filterGroup}>
        <label htmlFor="vesselType">Vessel Type:</label>
        <select
          id="vesselType"
          value={filters.vesselType}
          onChange={(e) => handleFilterChange('vesselType', e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="cargo">Cargo</option>
          <option value="tanker">Tanker</option>
          <option value="fishing">Fishing</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="dark">Dark Mode</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="timeRange">Time Range:</label>
        <select
          id="timeRange"
          value={filters.timeRange}
          onChange={(e) => handleFilterChange('timeRange', e.target.value)}
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>
    </div>
  );
};

export default FilterControls; 