'use client';

import React from 'react';
import styles from './AlertPanel.module.css';
import { Alert } from '../types';

interface AlertPanelProps {
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onAlertClick }) => {
  return (
    <div className={styles.alertPanel}>
      <h2>Dark Vessel Alerts</h2>
      <div className={styles.alertList}>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`${styles.alertItem} ${styles[alert.severity]}`}
            onClick={() => onAlertClick(alert)}
          >
            <div className={styles.alertHeader}>
              <span className={styles.vesselName}>{alert.vessel.name}</span>
              <span className={styles.timestamp}>{alert.timestamp}</span>
            </div>
            <div className={styles.alertDetails}>
              <span className={styles.alertType}>{alert.type}</span>
              <p className={styles.description}>{alert.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertPanel; 