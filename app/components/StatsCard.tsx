import React from 'react';

interface StatsCardProps {
  title: string;
  count: number;
  trend: number;
  className?: string;
}

export default function StatsCard({ title, count, trend, className = '' }: StatsCardProps) {
  const isPositive = trend > 0;
  const trendColor = isPositive ? 'text-green-400' : 'text-red-400';
  const trendIcon = isPositive ? 'fa-arrow-up' : 'fa-arrow-down';

  return (
    <div className={`bg-[#2d3748]/80 backdrop-blur-sm border border-[#2d3748] rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-300 text-sm font-medium uppercase tracking-wider">{title}</span>
        <i className="fas fa-ship text-blue-400 text-xl"></i>
      </div>
      <div className="text-4xl font-bold text-white mb-2">{count}</div>
      <div className={`flex items-center ${trendColor} text-sm`}>
        <i className={`fas ${trendIcon} mr-1`}></i>
        <span>{Math.abs(trend)}%</span>
      </div>
    </div>
  );
} 