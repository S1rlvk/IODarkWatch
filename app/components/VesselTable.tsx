import React from 'react';
import { Vessel } from '../types';

interface VesselTableProps {
  vessels: Vessel[];
  onVesselSelect?: (vessel: Vessel) => void;
}

const VesselTable: React.FC<VesselTableProps> = ({ vessels, onVesselSelect }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-black/30 text-left">
            <th className="px-4 py-3 text-sm font-medium text-gray-400">Vessel Name</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-400">Type</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-400">Status</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-400">Position</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-400">Speed</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-400">Course</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-400">Confidence</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {vessels.map((vessel) => (
            <tr 
              key={vessel.id}
              onClick={() => onVesselSelect?.(vessel)}
              className="hover:bg-white/5 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-white">{vessel.name}</div>
              </td>
              <td className="px-4 py-3 text-gray-300">{vessel.type}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  vessel.status === 'dark' ? 'bg-red-500/20 text-red-400' :
                  vessel.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {vessel.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-300 font-mono">
                {vessel.location.lat.toFixed(3)}°, {vessel.location.lng.toFixed(3)}°
              </td>
              <td className="px-4 py-3 text-gray-300">{vessel.speed} knots</td>
              <td className="px-4 py-3 text-gray-300">{vessel.course}°</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        (vessel.confidence || 0) > 0.7 ? 'bg-red-500' :
                        (vessel.confidence || 0) > 0.4 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(vessel.confidence || 0) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-300">
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