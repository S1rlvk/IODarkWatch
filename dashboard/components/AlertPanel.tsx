import React from 'react';
import styles from '../styles/AlertPanel.module.css';
import { Vessel, Alert } from '../../app/types';

interface AlertPanelProps {
  alerts: Alert[];
  loading: boolean;
  onAlertClick: (alert: Alert) => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({
  alerts,
  loading,
  onAlertClick,
}) => {
  if (loading) {
    return (
      <div className={styles.alertPanel}>
        <h3>Dark Vessel Alerts</h3>
        <div className={styles.loading}>Loading alerts...</div>
      </div>
    );
  }

  return (
    <div className={styles.alertPanel}>
      <h3>Dark Vessel Alerts</h3>
      <div className={styles.alertList}>
        {alerts.length === 0 ? (
          <div className={styles.noAlerts}>No dark vessel alerts in the selected time range</div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={styles.alertItem}
              onClick={() => onAlertClick(alert)}
            >
              <div className={styles.alertHeader}>
                <span className={styles.vesselName}>
                  {alert.vessel.name || 'Unknown Vessel'}
                </span>
                <span className={styles.timestamp}>
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className={styles.alertDetails}>
                <p>MMSI: {alert.vessel.mmsi}</p>
                <p>Type: {alert.vessel.type}</p>
                <p>Severity: {alert.severity}</p>
                <p className={styles.details}>{alert.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 