'use client';

import React, { useState } from 'react';
import { 
  MapIcon, 
  TableCellsIcon, 
  CommandLineIcon, 
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface IndustrialLayoutProps {
  children: React.ReactNode;
}

export const IndustrialLayout: React.FC<IndustrialLayoutProps> = ({ children }) => {
  const [activeNav, setActiveNav] = useState('map');
  const [showConsole, setShowConsole] = useState(false);

  const navItems = [
    { id: 'map', icon: MapIcon, label: 'Map View' },
    { id: 'table', icon: TableCellsIcon, label: 'Vessel Table' },
    { id: 'analytics', icon: ChartBarIcon, label: 'Analytics' },
    { id: 'console', icon: CommandLineIcon, label: 'Console' },
    { id: 'settings', icon: Cog6ToothIcon, label: 'Settings' },
    { id: 'alerts', icon: BellIcon, label: 'Alerts' },
  ];

  return (
    <div className="flex h-screen bg-bg-primary text-white">
      {/* Left Sidebar */}
      <div className="w-[60px] bg-surface border-r border-border flex flex-col items-center py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`relative w-12 h-12 mb-2 flex items-center justify-center rounded-sm transition-all
                ${isActive ? 'text-accent-blue' : 'text-gray-400 hover:text-white'}
                hover:shadow-glow group`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-blue" />
              )}
              <Icon className="w-6 h-6" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-surface text-sm rounded-sm
                opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-14 bg-surface border-b border-border flex items-center px-6">
          <h1 className="font-heading text-xl font-bold text-white">IODarkWatch</h1>
        </div>

        {/* Main Area */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        {/* Console Panel */}
        {showConsole && (
          <div className="h-64 bg-surface border-t border-border font-mono text-sm p-4 overflow-auto">
            <div className="text-accent-teal">[INFO] Loading vessel data...</div>
            <div className="text-accent-blue">[INFO] Processing AIS updates...</div>
            <div className="text-yellow-500">[WARN] Connection latency: 120ms</div>
          </div>
        )}
      </div>
    </div>
  );
}; 