'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Satellite, Map, RefreshCw, TrendingUp, Shield, Database, Radio } from 'lucide-react';
import { Vessel, AlertType, ALERT_META, generateVesselData } from '@/app/lib/vessels';

export default function DashboardPage() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Starts null so the server-rendered markup and the first client render match;
  // a Date created at render time would differ between the two and break hydration.
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filters, setFilters] = useState({
    showDarkVessel: true,
    showAisGap: true,
    showSpoofing: true,
    showRoutine: true,
    timeRange: 24,
  });

  useEffect(() => {
    loadVessels();

    if (autoRefresh) {
      const interval = setInterval(() => {
        loadVessels();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadVessels = async () => {
    try {
      const response = await fetch('/api/vessels');
      const data = await response.json();
      setVessels(data.vessels || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load vessels:', error);
      setVessels(generateVesselData());
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  const alertFilterKey: Record<Exclude<AlertType, null>, keyof typeof filters> = {
    dark_vessel: 'showDarkVessel',
    ais_gap: 'showAisGap',
    spoofing_signature: 'showSpoofing',
  };

  const getFilteredVessels = () => {
    const timeThreshold = Date.now() - filters.timeRange * 60 * 60 * 1000;
    return vessels.filter((vessel) => {
      if (vessel.alertType === null) {
        if (!filters.showRoutine) return false;
      } else if (!filters[alertFilterKey[vessel.alertType]]) {
        return false;
      }
      return vessel.lastSeen >= timeThreshold;
    });
  };

  const getVesselCounts = () => {
    const filtered = getFilteredVessels();
    return {
      darkVessel: filtered.filter((v) => v.alertType === 'dark_vessel').length,
      aisGap: filtered.filter((v) => v.alertType === 'ais_gap').length,
      spoofingSignature: filtered.filter((v) => v.alertType === 'spoofing_signature').length,
      total: filtered.length,
    };
  };

  const counts = getVesselCounts();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Top Navigation Bar */}
      <div className="bg-[#1a1a1a] border-b border-[#333] px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Satellite className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-white">IODarkWatch</h1>
            </div>
            <div className="text-sm text-gray-400">Demo dashboard &middot; simulated data</div>
            <nav className="flex items-center space-x-4 text-sm">
              <a href="/about" className="text-gray-400 hover:text-white transition-colors">How this works</a>
              <a href="/brief" className="text-gray-400 hover:text-white transition-colors">Weekly brief</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '—'}
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">SIMULATED</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#1a1a1a] border-r border-[#333] min-h-screen p-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                About this demo
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Every vessel below is simulated. There is no live AIS feed or satellite pipeline behind this
                dashboard yet &mdash; see <a href="/about" className="text-blue-400 hover:underline">How this works</a> for what&apos;s real and what isn&apos;t.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Alert Types
              </h3>
              <div className="space-y-2">
                {(Object.keys(ALERT_META) as Array<Exclude<AlertType, null>>).map((key) => (
                  <div key={key} className="p-3 bg-[#2a2a2a] rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ALERT_META[key].color }} />
                      <span className="text-sm text-gray-200 font-medium">{ALERT_META[key].label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{ALERT_META[key].description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Satellite className="w-5 h-5 text-red-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{counts.darkVessel}</div>
              <div className="text-sm text-gray-400">Dark Vessels</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Radio className="w-5 h-5 text-orange-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{counts.aisGap}</div>
              <div className="text-sm text-gray-400">AIS Gaps</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-yellow-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{counts.spoofingSignature}</div>
              <div className="text-sm text-gray-400">Spoofing Signatures</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{counts.total}</div>
              <div className="text-sm text-gray-400">Total Tracked</div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Controls</h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span>Auto Refresh</span>
                </label>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg text-sm text-gray-300 transition-colors"
                >
                  {showMap ? 'Show List' : 'Show Map'}
                </button>
                <button
                  onClick={loadVessels}
                  className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg text-sm text-gray-300 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-6 flex-wrap gap-y-2">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={filters.showDarkVessel}
                    onChange={(e) => setFilters((prev) => ({ ...prev, showDarkVessel: e.target.checked }))}
                    className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <span>Dark Vessel</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={filters.showAisGap}
                    onChange={(e) => setFilters((prev) => ({ ...prev, showAisGap: e.target.checked }))}
                    className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                  />
                  <span>AIS Gap</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={filters.showSpoofing}
                    onChange={(e) => setFilters((prev) => ({ ...prev, showSpoofing: e.target.checked }))}
                    className="w-4 h-4 text-yellow-600 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                  />
                  <span>Spoofing Signature</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={filters.showRoutine}
                    onChange={(e) => setFilters((prev) => ({ ...prev, showRoutine: e.target.checked }))}
                    className="w-4 h-4 text-gray-500 bg-gray-700 border-gray-600 rounded focus:ring-gray-400"
                  />
                  <span>Routine</span>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Time Range:</span>
                <select
                  value={filters.timeRange}
                  onChange={(e) => setFilters((prev) => ({ ...prev, timeRange: parseInt(e.target.value) }))}
                  className="bg-[#2a2a2a] border border-[#444] rounded px-3 py-1 text-sm text-white"
                >
                  <option value={1}>1 hour</option>
                  <option value={6}>6 hours</option>
                  <option value={24}>24 hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          {showMap ? (
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Vessel Tracking Map</h3>
                <div className="text-sm text-gray-400">
                  Showing {getFilteredVessels().length} vessels
                </div>
              </div>
              <div className="h-96 bg-[#0a0a0a] border border-[#333] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400 mb-2">Interactive vessel map</p>
                  <p className="text-sm text-gray-500">Placeholder &mdash; switch to list view below for live data</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Vessel List</h3>
                <div className="text-sm text-gray-400">
                  {getFilteredVessels().length} vessels tracked
                </div>
              </div>

              <div className="space-y-3">
                {getFilteredVessels().map((vessel) => (
                  <div key={vessel.id} className="bg-[#2a2a2a] border border-[#444] rounded-lg p-4 hover:bg-[#3a3a3a] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${vessel.severity === 'high' ? 'animate-pulse' : ''}`}
                          style={{ backgroundColor: vessel.alertType ? ALERT_META[vessel.alertType].color : '#6b7280' }}
                        />
                        <div>
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-200">
                              {vessel.name ?? 'Unidentified Contact'}
                            </span>
                            <span className="text-sm text-gray-400">
                              {vessel.type}{vessel.mmsi ? ` • MMSI: ${vessel.mmsi}` : ''}
                            </span>
                            {vessel.alertType && (
                              <span
                                className="text-xs px-2 py-1 rounded"
                                style={{
                                  color: ALERT_META[vessel.alertType].color,
                                  backgroundColor: `${ALERT_META[vessel.alertType].color}20`,
                                }}
                              >
                                {ALERT_META[vessel.alertType].label.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {vessel.lat.toFixed(4)}, {vessel.lng.toFixed(4)} • {vessel.speed.toFixed(1)} kn — {vessel.reason}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(vessel.lastSeen).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
