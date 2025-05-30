'use client';

import React from 'react';
import styles from './AlertPanel.module.css';
import { Alert, Vessel, AlertPanelProps } from '../types';

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, selectedVessel }) => {
  return (
    <div>
      <h3>Alerts</h3>
      <div>
        {alerts.map(alert => (
          <div key={alert.id}>
            <p>{alert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertPanel; 