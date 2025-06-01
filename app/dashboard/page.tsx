'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Ship, Satellite, Activity, Eye, MapPin, Clock, TrendingUp, Radar, Waves } from 'lucide-react';

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
    { label: "Active Alerts", value: activeAlerts, icon: AlertTriangle, color: "from-red-500 to-red-600", iconColor: "text-red-400" },
    { label: "Vessels Tracked", value: "2,847", icon: Ship, color: "from-blue-500 to-blue-600", iconColor: "text-blue-400" },
    { label: "SAR Scans Today", value: "156", icon: Satellite, color: "from-green-500 to-green-600", iconColor: "text-green-400" },
    { label: "Coverage Area", value: "1.2M km²", icon: MapPin, color: "from-purple-500 to-purple-600", iconColor: "text-purple-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-lg border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Eye className="h-10 w-10 text-cyan-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  IODarkWatch
                </h1>
              </div>
              <div className="flex items-center space-x-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-green-400">{isLive ? 'LIVE' : 'OFFLINE'}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                <div className="text-sm font-medium text-white">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-xs text-gray-400">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                  <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Waves className="h-5 w-5 text-cyan-400" />
                    <span>Indian Ocean Coverage</span>
                  </h2>
                  <div className="flex items-center space-x-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30">
                    <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                    <span className="text-sm text-green-400 font-medium">Real-time</span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Map */}
              <div className="h-96 bg-gradient-to-br from-blue-900/50 via-cyan-900/30 to-blue-800/50 relative overflow-hidden">
                {/* Ocean water effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 animate-pulse"></div>
                
                {/* Enhanced vessel markers with glow */}
                <div className="absolute top-1/4 left-1/3 group">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Dark Vessel
                  </div>
                </div>
                <div className="absolute top-1/2 right-1/4 group">
                  <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Normal Track
                  </div>
                </div>
                <div className="absolute bottom-1/3 left-1/2 group">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    AIS Gap
                  </div>
                </div>
                <div className="absolute top-1/3 right-1/3 group">
                  <div className="w-4 h-4 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-400/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Monitored
                  </div>
                </div>
                
                {/* Enhanced grid lines */}
                <div className="absolute inset-0 opacity-30">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute border-cyan-400/30" 
                         style={{
                           left: `${(i + 1) * 12.5}%`,
                           top: 0,
                           bottom: 0,
                           borderLeft: '1px dashed'
                         }}></div>
                  ))}
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute border-cyan-400/30" 
                         style={{
                           top: `${(i + 1) * 16.67}%`,
                           left: 0,
                           right: 0,
                           borderTop: '1px dashed'
                         }}></div>
                  ))}
                </div>

                {/* Enhanced Legend */}
                <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="text-xs font-medium text-cyan-400 mb-3 flex items-center space-x-2">
                    <Radar className="h-3 w-3" />
                    <span>Legend</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
                      <span className="text-gray-300">Dark Vessel</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
                      <span className="text-gray-300">AIS Gap</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
                      <span className="text-gray-300">Normal</span>
                    </div>
                  </div>
                </div>

                {/* SAR Scan Info */}
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="text-xs font-medium text-cyan-400 flex items-center space-x-2">
                    <Satellite className="h-3 w-3 animate-pulse" />
                    <span>Last SAR Scan</span>
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    {new Date(Date.now() - 120000).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="space-y-6">
            {/* Active Alerts */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <span>Active Alerts</span>
                  </h2>
                  <span className="bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium px-3 py-1 rounded-full">
                    {activeAlerts}
                  </span>
                </div>
              </div>
              
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {mockAlerts.map((alert) => (
                  <div key={alert.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full shadow-lg ${
                          alert.status === 'active' ? 'bg-red-500 animate-pulse shadow-red-500/50' : 'bg-yellow-500 shadow-yellow-500/50'
                        }`}></div>
                        <span className="font-medium text-white text-sm">{alert.vessel}</span>
                      </div>
                      <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-lg border border-white/20">
                        {alert.type}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-xs text-gray-400">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-cyan-400" />
                        <span className="text-gray-300">{alert.coordinates}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-cyan-400" />
                        <span className="text-gray-300">{alert.lastSeen}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-gray-400">Confidence:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${alert.confidence}%` }}
                            ></div>
                          </div>
                          <span className="font-medium text-cyan-400">{alert.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  <span>System Status</span>
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {[
                  { name: "SAR Processing", status: "Online" },
                  { name: "AIS Correlation", status: "Active" },
                  { name: "Detection Engine", status: "Running" },
                  { name: "API Status", status: "Healthy" }
                ].map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-sm text-gray-300">{service.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                      <span className="text-sm text-green-400 font-medium">{service.status}</span>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="text-xs text-gray-400">
                    Last deployment: {new Date(Date.now() - 3600000).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">
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