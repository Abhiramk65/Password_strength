import React from 'react';
import { Clock, Cpu, Globe, Zap } from 'lucide-react';
import { calculateTimeBreakdown } from '../utils/passwordStrength';
import { TimeBreakdownDisplay } from './TimeBreakdown';

interface CrackTimeDisplayProps {
  crackTimes: {
    onlineThrottling100perHour: string;
    onlineNoThrottling10perSecond: string;
    offlineSlowHashing1e4perSecond: string;
    offlineFastHashing1e10perSecond: string;
  };
  crackTimeSeconds: {
    onlineThrottling100perHour: number;
    onlineNoThrottling10perSecond: number;
    offlineSlowHashing1e4perSecond: number;
    offlineFastHashing1e10perSecond: number;
  };
}

export const CrackTimeDisplay: React.FC<CrackTimeDisplayProps> = ({ crackTimes, crackTimeSeconds }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex items-center gap-2 text-gray-700 mb-3">
          <Globe className="w-5 h-5 text-blue-600" />
          <span className="font-medium">Online Throttled Attack</span>
        </div>
        <div className="text-sm text-gray-500 mb-3">
          Simulates an online attack limited to 100 attempts per hour
        </div>
        <TimeBreakdownDisplay 
          time={calculateTimeBreakdown(crackTimeSeconds.onlineThrottling100perHour)} 
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex items-center gap-2 text-gray-700 mb-3">
          <Clock className="w-5 h-5 text-orange-600" />
          <span className="font-medium">Online No Throttling</span>
        </div>
        <div className="text-sm text-gray-500 mb-3">
          Simulates an online attack with 10 attempts per second
        </div>
        <TimeBreakdownDisplay 
          time={calculateTimeBreakdown(crackTimeSeconds.onlineNoThrottling10perSecond)} 
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex items-center gap-2 text-gray-700 mb-3">
          <Cpu className="w-5 h-5 text-purple-600" />
          <span className="font-medium">Offline Slow Hash</span>
        </div>
        <div className="text-sm text-gray-500 mb-3">
          Simulates an offline attack with 10k hashes per second
        </div>
        <TimeBreakdownDisplay 
          time={calculateTimeBreakdown(crackTimeSeconds.offlineSlowHashing1e4perSecond)} 
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex items-center gap-2 text-gray-700 mb-3">
          <Zap className="w-5 h-5 text-yellow-600" />
          <span className="font-medium">Offline Fast Hash</span>
        </div>
        <div className="text-sm text-gray-500 mb-3">
          Simulates an offline attack with 10B hashes per second
        </div>
        <TimeBreakdownDisplay 
          time={calculateTimeBreakdown(crackTimeSeconds.offlineFastHashing1e10perSecond)} 
        />
      </div>
    </div>
  );
};