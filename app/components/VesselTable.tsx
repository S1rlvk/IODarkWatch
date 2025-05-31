import React from 'react';
import { Vessel } from '../types';

interface VesselTableProps {
  vessels: Vessel[];
  onVesselSelect?: (vessel: Vessel) => void;
}

const VesselTable: React.FC<VesselTableProps> = ({ vessels, onVesselSelect }) => {
  if (vessels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No vessels detected</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Vessel Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Position</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Speed</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Course</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Confidence</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {vessels.map((vessel) => (
            <tr 
              key={vessel.id}
              onClick={() => onVesselSelect?.(vessel)}
              className="hover:bg-white/5 cursor-pointer transition-all duration-200"
            >
              <td className="px-4 py-4">
                <div className="font-medium text-white">{vessel.name}</div>
              </td>
              <td className="px-4 py-4 text-gray-300 text-sm">{vessel.type}</td>
              <td className="px-4 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  vessel.status === 'dark' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  vessel.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {vessel.status === 'dark' && '⚠️ '}
                  {vessel.status.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-4 text-gray-300 font-mono text-sm">
                {vessel.location.lat.toFixed(3)}°, {vessel.location.lng.toFixed(3)}°
              </td>
              <td className="px-4 py-4 text-gray-300 text-sm">{vessel.speed} kn</td>
              <td className="px-4 py-4 text-gray-300 text-sm">{vessel.course}°</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        (vessel.confidence || 0) > 0.8 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        (vessel.confidence || 0) > 0.5 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                        'bg-gradient-to-r from-green-500 to-green-400'
                      }`}
                      style={{ width: `${(vessel.confidence || 0) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-400 min-w-[3rem] text-right">
                    {((vessel.confidence || 0) * 100).toFixed(0)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VesselTable; 