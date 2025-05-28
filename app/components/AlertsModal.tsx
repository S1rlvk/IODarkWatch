'use client';

import React from 'react';
import { Alert } from '../types';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  onAlertSelect: (alert: Alert) => void;
}

const AlertsModal: React.FC<AlertsModalProps> = ({ isOpen, onClose, alerts, onAlertSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-[#1a1a1a] w-3/4 h-3/4 rounded-lg overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Vessel Alerts</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {alerts.map(alert => (
              <div
                key={alert.id}
                onClick={() => onAlertSelect(alert)}
                className="bg-[#333] rounded-lg p-4 cursor-pointer hover:bg-[#444] transition-colors border border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      {alert.type === 'dark_vessel' ? 'Dark Vessel Detected' : 'Suspicious Activity'}
                    </h3>
                    <p className="text-gray-300 text-sm mb-2">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                    <p className="text-gray-300 text-sm mb-2">
                      Location: {alert.location.lat.toFixed(4)}°, {alert.location.lng.toFixed(4)}°
                    </p>
                    <p className="text-gray-300 text-sm">
                      {alert.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      alert.severity === 'high' ? 'bg-red-500' :
                      alert.severity === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsModal; 