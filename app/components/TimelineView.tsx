import React from 'react';
import styles from './TimelineView.module.css';
import { Alert } from '../types';

interface TimelineViewProps {
  timeRange: [Date, Date];
  onTimeRangeChange: (timeRange: [Date, Date]) => void;
  events: Alert[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeRange, onTimeRangeChange, events }) => {
  return (
    <div className={styles.timelineContainer}>
      <h2>Vessel Timeline</h2>
      <div className={styles.timeline}>
        {events.map((event) => (
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