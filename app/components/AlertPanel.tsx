'use client';

import React from 'react';
import styles from './AlertPanel.module.css';
import { Alert } from '../types';

interface AlertPanelProps {
  alerts: Alert[];
  loading: boolean;
  onAlertClick: (alert: Alert) => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, loading, onAlertClick }) => {
  if (loading) {
    return (
      <div className={styles.alertPanel}>
        <h2>Dark Vessel Alerts</h2>
        <div className={styles.loading}>Loading alerts...</div>
      </div>
    );
  }

  return (
    <div className={styles.alertPanel}>
      <h2>Dark Vessel Alerts</h2>
      <div className={styles.alertList}>
        {alerts.length === 0 ? (
          <div className={styles.noAlerts}>No dark vessel alerts in the selected time range</div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`${styles.alertItem} ${styles[alert.severity]}`}
              onClick={() => onAlertClick(alert)}
            >
              <div className={styles.alertHeader}>
                <span className={styles.vesselName}>{alert.vessel.name || 'Unknown Vessel'}</span>
                <span className={styles.timestamp}>{new Date(alert.timestamp).toLocaleString()}</span>
              </div>
              <div className={styles.alertDetails}>
                <span className={styles.alertType}>{alert.type}</span>
                <p className={styles.description}>{alert.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 