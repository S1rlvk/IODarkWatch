import React, { useState, useEffect } from 'react';
import styles from '../styles/FilterControls.module.css';

interface FilterState {
  vesselTypes: string[];
  riskLevels: string[];
  regions: string[];
}

interface FilterControlsProps {
  onFilterChange: (filters: FilterState) => void;
  filters: FilterState;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ onFilterChange, filters }) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    const newFilters = { ...localFilters };
    
    if (value === 'all') {
      newFilters[filterType] = [];
    } else {
      newFilters[filterType] = [value];
    }
    
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className={styles.filterControls}>
      <h3 className="gradient-text" style={{ marginBottom: '1.5rem' }}>Filters</h3>
      
      <div className={styles.filterGroup}>
        <label htmlFor="vesselType">Vessel Type</label>
        <select
          id="vesselType"
          value={localFilters.vesselTypes[0] || 'all'}
          onChange={(e) => handleFilterChange('vesselTypes', e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Tanker">Tanker</option>
          <option value="Cargo">Cargo</option>
          <option value="Fishing">Fishing</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="riskLevel">Risk Level</label>
        <select
          id="riskLevel"
          value={localFilters.riskLevels[0] || 'all'}
          onChange={(e) => handleFilterChange('riskLevels', e.target.value)}
        >
          <option value="all">All Levels</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="region">Region</label>
        <select
          id="region"
          value={localFilters.regions[0] || 'all'}
          onChange={(e) => handleFilterChange('regions', e.target.value)}
        >
          <option value="all">All Regions</option>
          <option value="Indian Ocean">Indian Ocean</option>
          <option value="Arabian Sea">Arabian Sea</option>
          <option value="Bay of Bengal">Bay of Bengal</option>
        </select>
      </div>
    </div>
  );
};

export default FilterControls; 