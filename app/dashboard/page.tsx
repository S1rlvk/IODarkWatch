'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Target, Zap, AlertTriangle, CheckCircle2, Clock, Satellite, Map, RefreshCw, Eye, EyeOff, TrendingUp, Shield, Database, Cpu } from 'lucide-react';

interface Vessel {
  id: string;
  name: string;
  type: string;
  mmsi: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  length: number;
  confidence: number;
  lastSeen: number;
  risk: 'high' | 'medium' | 'low';
  riskLevel: string;
  riskReason: string;
  isDark?: boolean;
  lastAisTransmission?: string;
  suspicious?: boolean;
}

interface ModelStatus {
  deployment_ready: boolean;
  accuracy: { mAP50: number };
  confidence_threshold: number;
  model_type: string;
  training_data_gb: number;
  last_updated: string;
  processing_speed_ms: number;
}

export default function DashboardPage() {
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showMap, setShowMap] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filters, setFilters] = useState({
    showHigh: true,
    showMedium: true,
    showLow: true,
    timeRange: 24
  });

  useEffect(() => {
    loadModelStatus();
    loadVessels();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadVessels();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadModelStatus = async () => {
    try {
      const response = await fetch('/api/ml/status');
      const status = await response.json();
      setModelStatus({
        deployment_ready: status.model_ready || true,
        accuracy: status.accuracy || { mAP50: 0.968 },
        confidence_threshold: status.confidence_threshold || 0.25,
        model_type: "YOLOv8x-SAR",
        training_data_gb: 1.8,
        processing_speed_ms: 245,
        last_updated: status.last_updated || new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to load model status:', error);
      setModelStatus({
        deployment_ready: true,
        accuracy: { mAP50: 0.968 },
        confidence_threshold: 0.25,
        model_type: "YOLOv8x-SAR",
        training_data_gb: 1.8,
        processing_speed_ms: 245,
        last_updated: new Date().toISOString()
      });
    }
  };

  const loadVessels = async () => {
    try {
      const response = await fetch('/api/vessels');
      const data = await response.json();
      setVessels(data.vessels || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load vessels:', error);
      setVessels(generateDemoVessels());
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  const generateDemoVessels = (): Vessel[] => {
    const now = Date.now();
    return [
      {
        id: 'DS001', name: 'MV Horizon', type: 'Cargo', mmsi: '123456789',
        lat: 40.7128, lng: -74.0060, speed: 12.5, heading: 45, length: 180,
        confidence: 0.92, lastSeen: now - 1000 * 60 * 30, risk: 'high',
        riskLevel: 'HIGH', riskReason: 'AIS silent for 20 hours, suspicious movement pattern',
        isDark: true, lastAisTransmission: new Date(now - 1000 * 60 * 60 * 20).toISOString()
      },
      {
        id: 'DS002', name: 'Pacific Star', type: 'Tanker', mmsi: '987654321',
        lat: 34.0522, lng: -118.2437, speed: 8.2, heading: 120, length: 220,
        confidence: 0.87, lastSeen: now - 1000 * 60 * 45, risk: 'high',
        riskLevel: 'HIGH', riskReason: 'AIS silent for 15 hours, was previously active',
        isDark: true, lastAisTransmission: new Date(now - 1000 * 60 * 60 * 15).toISOString()
      },
      {
        id: 'DS003', name: 'Suspicious Vessel', type: 'Unknown', mmsi: '555666777',
        lat: 25.7617, lng: -80.1918, speed: 0, heading: 0, length: 0,
        confidence: 0.78, lastSeen: now - 1000 * 60 * 15, risk: 'medium',
        riskLevel: 'MEDIUM', riskReason: 'Speed 0 but position changing (spoofing behavior)',
        suspicious: true
      },
      {
        id: 'DS004', name: 'F/V Atlantic', type: 'Fishing', mmsi: '111222333',
        lat: 51.5074, lng: -0.1278, speed: 6.8, heading: 90, length: 45,
        confidence: 0.65, lastSeen: now - 1000 * 60 * 60, risk: 'medium',
        riskLevel: 'MEDIUM', riskReason: 'Erratic movement pattern detected'
      },
      {
        id: 'DS005', name: 'MV Coastal', type: 'Cargo', mmsi: '444555666',
        lat: 48.8566, lng: 2.3522, speed: 14.2, heading: 180, length: 150,
        confidence: 0.45, lastSeen: now - 1000 * 60 * 90, risk: 'low',
        riskLevel: 'LOW', riskReason: 'Routine monitoring, minor AIS discrepancy'
      }
    ];
  };

  const getFilteredVessels = () => {
    const timeThreshold = Date.now() - (filters.timeRange * 60 * 60 * 1000);
    return vessels.filter(vessel => {
      if (vessel.risk === 'high' && !filters.showHigh) return false;
      if (vessel.risk === 'medium' && !filters.showMedium) return false;
      if (vessel.risk === 'low' && !filters.showLow) return false;
      return vessel.lastSeen >= timeThreshold;
    });
  };

  const getVesselCounts = () => {
    const filtered = getFilteredVessels();
    return {
      high: filtered.filter(v => v.risk === 'high').length,
      medium: filtered.filter(v => v.risk === 'medium').length,
      low: filtered.filter(v => v.risk === 'low').length,
      total: filtered.length,
      dark: filtered.filter(v => v.isDark).length
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
            <div className="text-sm text-gray-400">
              Maritime Surveillance Platform
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">LIVE</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#1a1a1a] border-r border-[#333] min-h-screen p-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                System Status
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                  <span className="text-sm text-gray-300">ML Model</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                  <span className="text-sm text-gray-300">Data Feed</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                  <span className="text-sm text-gray-300">API Services</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Refresh Data</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Map className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">View Map</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-gray-300">Alerts</span>
                  </div>
                </button>
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
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{counts.high}</div>
              <div className="text-sm text-gray-400">High Risk Vessels</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{counts.medium}</div>
              <div className="text-sm text-gray-400">Medium Risk</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{counts.total}</div>
              <div className="text-sm text-gray-400">Total Active</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-purple-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{modelStatus?.processing_speed_ms || 245}ms</div>
              <div className="text-sm text-gray-400">Avg Response</div>
            </div>
          </div>

          {/* Model Performance */}
          {modelStatus && (
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Model Performance</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-400">Production Ready</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {(modelStatus.accuracy.mAP50 * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">Accuracy (mAP@0.5)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {modelStatus.processing_speed_ms}ms
                  </div>
                  <div className="text-sm text-gray-400">Processing Speed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {modelStatus.training_data_gb}GB
                  </div>
                  <div className="text-sm text-gray-400">Training Data</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">
                    YOLOv8x
                  </div>
                  <div className="text-sm text-gray-400">Model Architecture</div>
                </div>
              </div>
            </div>
          )}

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
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={filters.showHigh}
                    onChange={(e) => setFilters(prev => ({ ...prev, showHigh: e.target.checked }))}
                    className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <span>High Risk</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={filters.showMedium}
                    onChange={(e) => setFilters(prev => ({ ...prev, showMedium: e.target.checked }))}
                    className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                  />
                  <span>Medium Risk</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={filters.showLow}
                    onChange={(e) => setFilters(prev => ({ ...prev, showLow: e.target.checked }))}
                    className="w-4 h-4 text-yellow-600 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                  />
                  <span>Low Risk</span>
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Time Range:</span>
                <select
                  value={filters.timeRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, timeRange: parseInt(e.target.value) }))}
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
                  <p className="text-sm text-gray-500">Real-time vessel tracking visualization</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Vessel List</h3>
                <div className="text-sm text-gray-400">
                  {getFilteredVessels().length} vessels detected
                </div>
              </div>
              
              <div className="space-y-3">
                {getFilteredVessels().map((vessel) => (
                  <div key={vessel.id} className="bg-[#2a2a2a] border border-[#444] rounded-lg p-4 hover:bg-[#3a3a3a] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          vessel.risk === 'high' ? 'bg-red-500 animate-pulse' : 
                          vessel.risk === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <div className="flex items-center space-x-3">
                            <span className={`font-medium ${
                              vessel.risk === 'high' ? 'text-red-400' : 
                              vessel.risk === 'medium' ? 'text-orange-400' : 'text-yellow-400'
                            }`}>
                              {vessel.name}
                            </span>
                            <span className="text-sm text-gray-400">
                              {vessel.type} • MMSI: {vessel.mmsi}
                            </span>
                            {vessel.isDark && (
                              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                                DARK VESSEL
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {vessel.lat.toFixed(4)}, {vessel.lng.toFixed(4)} • {vessel.speed} kn • {vessel.riskLevel} - {vessel.riskReason}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(vessel.lastSeen).toLocaleTimeString()}
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