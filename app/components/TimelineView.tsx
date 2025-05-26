import React from 'react';
import styles from './TimelineView.module.css';

interface Vessel {
  id: string;
  name: string;
  type: string;
  lastKnownPosition: {
    lat: number;
    lng: number;
  };
  lastUpdate: string;
  status: 'active' | 'dark' | 'inactive';
}

interface TimelineViewProps {
  vessels: Vessel[];
}

const TimelineView: React.FC<TimelineViewProps> = ({ vessels }) => {
  return (
    <div className={styles.timelineContainer}>
      <h2>Vessel Timeline</h2>
      <div className={styles.timeline}>
        {vessels.map((vessel) => (
          <div key={vessel.id} className={styles.timelineItem}>
            <div className={styles.vesselInfo}>
              <h3>{vessel.name}</h3>
              <p>Type: {vessel.type}</p>
              <p>Status: {vessel.status}</p>
              <p>Last Update: {new Date(vessel.lastUpdate).toLocaleString()}</p>
            </div>
            <div className={styles.vesselPosition}>
              <p>Lat: {vessel.lastKnownPosition.lat}</p>
              <p>Lng: {vessel.lastKnownPosition.lng}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView; 