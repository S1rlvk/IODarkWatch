'use client';

import React, { useState } from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, onlyFlagged: boolean) => void;
  totalRecords: number;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport, totalRecords }) => {
  const [onlyFlagged, setOnlyFlagged] = useState(false);

  if (!isOpen) return null;

  const getEstimatedSize = (format: string) => {
    const avgRecordSize = {
      csv: 200, // bytes
      geojson: 500,
      json: 400
    };
    const size = totalRecords * avgRecordSize[format as keyof typeof avgRecordSize];
    return size < 1024 ? `${size} B` : `${(size / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-[#1a1a1a] w-96 rounded-lg p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Export Data</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="onlyFlagged"
              checked={onlyFlagged}
              onChange={(e) => setOnlyFlagged(e.target.checked)}
              className="rounded bg-[#333] border-gray-600 focus:ring-blue-500"
            />
            <label htmlFor="onlyFlagged" className="text-gray-300">
              Only export flagged vessels
            </label>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onExport('csv', onlyFlagged)}
              className="w-full bg-[#333] text-white py-2 rounded hover:bg-[#444] transition-colors flex justify-between items-center px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            >
              <span>Export as CSV</span>
              <span className="text-sm text-gray-400">
                ~{getEstimatedSize('csv')}
              </span>
            </button>

            <button
              onClick={() => onExport('geojson', onlyFlagged)}
              className="w-full bg-[#333] text-white py-2 rounded hover:bg-[#444] transition-colors flex justify-between items-center px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            >
              <span>Export as GeoJSON</span>
              <span className="text-sm text-gray-400">
                ~{getEstimatedSize('geojson')}
              </span>
            </button>

            <button
              onClick={() => onExport('json', onlyFlagged)}
              className="w-full bg-[#333] text-white py-2 rounded hover:bg-[#444] transition-colors flex justify-between items-center px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            >
              <span>Copy as JSON</span>
              <span className="text-sm text-gray-400">
                ~{getEstimatedSize('json')}
              </span>
            </button>
          </div>

          <p className="text-sm text-gray-400 mt-4">
            Total records: {totalRecords}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExportModal; 