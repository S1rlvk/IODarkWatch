import React from 'react';
import styles from '../styles/FilterControls.module.css';

interface FilterControlsProps {
  filters: {
    vesselTypes: string[];
    minSpeed: number;
    maxSpeed: number;
    darkVesselsOnly: boolean;
  };
  onFilterChange: (filters: FilterControlsProps['filters']) => void;
  onTimeRangeChange: (range: [Date, Date]) => void;
}

const VESSEL_TYPES = [
  'Cargo',
  'Tanker',
  'Fishing',
  'Passenger',
  'Military',
  'Other',
];

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFilterChange,
  onTimeRangeChange,
}) => {
  const handleVesselTypeToggle = (type: string) => {
    const newTypes = filters.vesselTypes.includes(type)
      ? filters.vesselTypes.filter(t => t !== type)
      : [...filters.vesselTypes, type];
    onFilterChange({ ...filters, vesselTypes: newTypes });
  };

  return (
    <div className={styles.filterControls}>
      <h3>Filters</h3>
      
      <div className={styles.section}>
        <h4>Vessel Types</h4>
        <div className={styles.vesselTypes}>
          {VESSEL_TYPES.map(type => (
            <label key={type} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={filters.vesselTypes.includes(type)}
                onChange={() => handleVesselTypeToggle(type)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4>Speed Range (knots)</h4>
        <div className={styles.speedRange}>
          <input
            type="range"
            min="0"
            max="30"
            value={filters.minSpeed}
            onChange={(e) => onFilterChange({
              ...filters,
              minSpeed: parseInt(e.target.value),
            })}
          />
          <span>{filters.minSpeed} - {filters.maxSpeed}</span>
          <input
            type="range"
            min="0"
            max="30"
            value={filters.maxSpeed}
            onChange={(e) => onFilterChange({
              ...filters,
              maxSpeed: parseInt(e.target.value),
            })}
          />
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={filters.darkVesselsOnly}
            onChange={(e) => onFilterChange({
              ...filters,
              darkVesselsOnly: e.target.checked,
            })}
          />
          Show Dark Vessels Only
        </label>
      </div>
    </div>
  );
}; 