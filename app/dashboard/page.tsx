'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Ship, Satellite, Activity, Eye, MapPin, Clock, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlerts, setActiveAlerts] = useState(12);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate live data updates
      if (Math.random() > 0.95) {
        setActiveAlerts(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const mockAlerts = [
    {
      id: 1,
      vessel: "Unknown Vessel",
      coordinates: "8.5°N, 76.2°E",
      lastSeen: "23 minutes ago",
      confidence: 94,
      type: "Dark Transit",
      status: "active"
    },
    {
      id: 2,
      vessel: "Fishing Vessel",
      coordinates: "12.1°N, 68.4°E",
      lastSeen: "1.2 hours ago",
      confidence: 87,
      type: "AIS Gap",
      status: "monitoring"
    },
    {
      id: 3,
      vessel: "Cargo Ship",
      coordinates: "15.3°N, 73.8°E",
      lastSeen: "45 minutes ago",
      confidence: 91,
      type: "Route Deviation",
      status: "active"
    }
  ];

  const stats = [
    { label: "Active Alerts", value: activeAlerts, icon: AlertTriangle, color: "text-red-500" },
    { label: "Vessels Tracked", value: "2,847", icon: Ship, color: "text-blue-500" },
    { label: "SAR Scans Today", value: "156", icon: Satellite, color: "text-green-500" },
    { label: "Coverage Area", value: "1.2M km²", icon: MapPin, color: "text-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  IODarkWatch
                </h1>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span>{isLive ? 'LIVE' : 'OFFLINE'}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Indian Ocean Coverage</h2>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Real-time</span>
                  </div>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="h-96 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-200 dark:bg-gray-600 opacity-30"></div>
                
                {/* Simulated vessel markers */}
                <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-500 rounded-full"></div>
                
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute border-gray-400 dark:border-gray-500" 
                         style={{
                           left: `${(i + 1) * 12.5}%`,
                           top: 0,
                           bottom: 0,
                           borderLeft: '1px dashed'
                         }}></div>
                  ))}
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute border-gray-400 dark:border-gray-500" 
                         style={{
                           top: `${(i + 1) * 16.67}%`,
                           left: 0,
                           right: 0,
                           borderTop: '1px dashed'
                         }}></div>
                  ))}
                </div>

                <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-medium text-gray-900 dark:text-white mb-2">Legend</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">Dark Vessel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">AIS Gap</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">Normal</span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-medium text-gray-900 dark:text-white">Last SAR Scan</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {new Date(Date.now() - 120000).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="space-y-6">
            {/* Active Alerts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Alerts</h2>
                  <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {activeAlerts}
                  </span>
                </div>
              </div>
              
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {mockAlerts.map((alert) => (
                  <div key={alert.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.status === 'active' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'
                        }`}></div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{alert.vessel}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                        {alert.type}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{alert.coordinates}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{alert.lastSeen}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Confidence:</span>
                        <span className="font-medium">{alert.confidence}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Status</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">SAR Processing</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900 dark:text-white">Online</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">AIS Correlation</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900 dark:text-white">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Detection Engine</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900 dark:text-white">Running</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">API Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900 dark:text-white">Healthy</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Last deployment: {new Date(Date.now() - 3600000).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Version: 2.1.4 • Uptime: 24h 12m
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 