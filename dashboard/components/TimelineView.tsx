import React from 'react';
import styles from '../styles/TimelineView.module.css';
import { Alert } from '../../app/types';

interface TimelineViewProps {
  timeRange: [Date, Date];
  onTimeRangeChange: (range: [Date, Date]) => void;
  events: Alert[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timeRange,
  onTimeRangeChange,
  events,
}) => {
  return (
    <div className={styles.timelineView}>
      <div className={styles.timelineHeader}>
        <h3>Timeline</h3>
        <div className={styles.timeRange}>
          {timeRange[0].toLocaleDateString()} - {timeRange[1].toLocaleDateString()}
        </div>
      </div>
      <div className={styles.eventsList}>
        {events.map((event) => (
          <div key={event.id} className={styles.eventItem}>
            <div className={styles.eventTime}>
              {new Date(event.timestamp).toLocaleTimeString()}
            </div>
            <div className={styles.eventDetails}>
              <div className={styles.vesselName}>{event.vessel.name}</div>
              <div className={styles.eventType}>{event.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 