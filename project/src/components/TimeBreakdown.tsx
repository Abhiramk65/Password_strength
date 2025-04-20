import React from 'react';
import { type TimeBreakdown } from '../utils/passwordStrength';

interface TimeBreakdownProps {
  time: TimeBreakdown;
  className?: string;
}

export const TimeBreakdownDisplay: React.FC<TimeBreakdownProps> = ({ time, className = '' }) => {
  const timeUnits = [
    { value: time.years, label: 'years', threshold: 31536000 },
    { value: time.months, label: 'months', threshold: 2592000 },
    { value: time.days, label: 'days', threshold: 86400 },
    { value: time.hours, label: 'hours', threshold: 3600 },
    { value: time.minutes, label: 'minutes', threshold: 60 },
    { value: time.seconds, label: 'seconds', threshold: 0 }
  ];

  // Filter out zero values and get significant units
  const significantUnits = timeUnits.filter(unit => unit.value > 0);

  // If all values are 0, show "instant"
  if (significantUnits.length === 0) {
    return (
      <div className={`space-y-1 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="font-mono bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
            instant
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {significantUnits.map(({ value, label, threshold }) => (
        <div key={label} className="flex items-center gap-2">
          <span className={`font-mono ${
            threshold === 0 ? 'bg-red-100 text-red-800' : 
            threshold < 3600 ? 'bg-orange-100 text-orange-800' : 
            threshold < 86400 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-green-100 text-green-800'
          } px-2 py-1 rounded text-sm`}>
            {value}
          </span>
          <span className="text-sm text-gray-600">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};