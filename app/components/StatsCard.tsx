import React from 'react';

interface StatsCardProps {
  title: string;
  count: number;
  trend?: number;
  className?: string;
}

export default function StatsCard({ title, count, trend, className = '' }: StatsCardProps) {
  return (
    <div className={`bg-[#1a1a1a] rounded-lg p-4 border border-[#333] ${className}`}>
      <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
      <div className="flex items-baseline">
        <p className="text-2xl font-semibold text-white">{count}</p>
        {trend !== undefined && (
          <span className={`ml-2 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
} 