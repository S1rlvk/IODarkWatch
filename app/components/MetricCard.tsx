'use client';

import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = ''
}) => {
  return (
    <div className={`bg-surface border border-border rounded-sm p-4 shadow-industrial ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-body text-sm text-gray-400 mb-1">{title}</h3>
          <div className="font-heading text-2xl font-bold text-white">{value}</div>
          {trend && (
            <div className={`mt-2 text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        {icon && (
          <div className="text-accent-blue">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}; 