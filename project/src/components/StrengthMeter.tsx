import React from 'react';
import { getScoreColor } from '../utils/passwordStrength';

interface StrengthMeterProps {
  score: number;
  className?: string;
}

export const StrengthMeter: React.FC<StrengthMeterProps> = ({ score, className = '' }) => {
  const segments = [0, 1, 2, 3, 4];
  const activeSegments = score + 1;

  return (
    <div className={`flex gap-1 w-full ${className}`}>
      {segments.map((segment) => (
        <div
          key={segment}
          className={`h-2 flex-1 rounded-full transition-all duration-300 ${
            segment < activeSegments ? getScoreColor(score) : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
};