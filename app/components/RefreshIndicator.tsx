import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface RefreshIndicatorProps {
  isRefreshing: boolean;
  lastUpdated?: string;
  nextRefreshIn?: number;
  onManualRefresh?: () => void;
  isDataStale?: boolean;
}

export const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({
  isRefreshing,
  lastUpdated,
  nextRefreshIn,
  onManualRefresh,
  isDataStale
}) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatNextRefresh = (seconds: number) => {
    if (seconds <= 0) return 'Refreshing...';
    if (seconds < 60) return `${Math.ceil(seconds)}s`;
    return `${Math.ceil(seconds / 60)}m`;
  };

  return (
    <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
      {/* Refresh Status Indicator */}
      <div className="flex items-center gap-2">
        <div className={`relative ${isRefreshing ? 'animate-spin' : ''}`}>
          <ArrowPathIcon className="w-4 h-4 text-cyan-400" />
          {isRefreshing && (
            <div className="absolute inset-0 w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          )}
        </div>
        
        <div className="flex flex-col text-xs">
          <span className={`font-medium ${isDataStale ? 'text-yellow-400' : 'text-gray-300'}`}>
            {isRefreshing ? 'Updating...' : 'Live Data'}
          </span>
          {lastUpdated && (
            <span className="text-gray-500">
              {formatTime(lastUpdated)}
            </span>
          )}
        </div>
      </div>

      {/* Next Refresh Timer */}
      {!isRefreshing && nextRefreshIn !== undefined && (
        <div className="flex items-center gap-1 text-xs">
          <div className={`w-2 h-2 rounded-full ${
            isDataStale ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
          }`}></div>
          <span className="text-gray-400">
            Next: {formatNextRefresh(nextRefreshIn)}
          </span>
        </div>
      )}

      {/* Manual Refresh Button */}
      {onManualRefresh && (
        <button
          onClick={onManualRefresh}
          disabled={isRefreshing}
          className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh now"
        >
          <ArrowPathIcon className={`w-4 h-4 text-gray-400 hover:text-cyan-400 ${
            isRefreshing ? 'animate-spin' : ''
          }`} />
        </button>
      )}
    </div>
  );
}; 