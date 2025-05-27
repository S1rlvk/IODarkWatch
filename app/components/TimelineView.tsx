import React from 'react';
import styles from './TimelineView.module.css';
import { TimelineViewProps } from '../types';

const TimelineView: React.FC<TimelineViewProps> = ({ timeRange, onTimeRangeChange, vessels, alerts }) => {
  return (
    <div className={styles.timelineContainer}>
      <h2>Vessel Timeline</h2>
      <div className={styles.timeline}>
        {alerts.map((event) => (
          <div key={event.id} className={styles.timelineItem}>
            <div className={styles.eventInfo}>
              <h3>{event.vessel.name || 'Unknown Vessel'}</h3>
              <p>Type: {event.type}</p>
              <p>Severity: {event.severity}</p>
              <p>Time: {new Date(event.timestamp).toLocaleString()}</p>
            </div>
            <div className={styles.eventDescription}>
              <p>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView; 