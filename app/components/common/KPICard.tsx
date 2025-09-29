"use client";

import React from 'react';
import { KPIMetric } from '../../lib/types/dashboard';

interface KPICardProps {
  metric: KPIMetric;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  metric,
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  const formatValue = (value: number | string, format: string): string => {
    if (typeof value === 'string') return value;

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'decimal':
        return value.toFixed(2);
      case 'number':
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  };

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-900';
    }
  };

  const getChangeColor = (type: 'increase' | 'decrease'): string => {
    return type === 'increase' ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (type: 'increase' | 'decrease'): React.ReactNode => {
    if (type === 'increase') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7m0 10H7" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10m0-10h10" />
      </svg>
    );
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const textSizeClasses = {
    sm: {
      value: 'text-xl',
      label: 'text-sm',
      change: 'text-xs'
    },
    md: {
      value: 'text-2xl',
      label: 'text-base',
      change: 'text-sm'
    },
    lg: {
      value: 'text-3xl',
      label: 'text-lg',
      change: 'text-base'
    }
  };

  const compactClass = variant === 'compact' ? 'space-y-1' : 'space-y-2';

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${sizeClasses[size]} ${className}`}>
      <div className={compactClass}>
        {/* Label */}
        <div className={`${textSizeClasses[size].label} font-medium text-gray-600 uppercase tracking-wide`}>
          {metric.label}
        </div>

        {/* Value */}
        <div className={`${textSizeClasses[size].value} font-bold ${getStatusColor(metric.status)}`}>
          {formatValue(metric.value, metric.format)}
        </div>

        {/* Change indicator */}
        {metric.change && (
          <div className={`flex items-center space-x-1 ${textSizeClasses[size].change}`}>
            <span className={`flex items-center ${getChangeColor(metric.change.type)}`}>
              {getChangeIcon(metric.change.type)}
              <span className="ml-1">
                {formatValue(Math.abs(metric.change.value), metric.format)}
              </span>
            </span>
            <span className="text-gray-500">
              from {metric.change.period}
            </span>
          </div>
        )}

        {/* Target progress */}
        {metric.target && typeof metric.value === 'number' && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Target</span>
              <span>{formatValue(metric.target, metric.format)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  metric.value >= metric.target ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
