
import React from 'react';
import { calculateLevel, getProgressPercentage } from '@/utils/levelCalculator';

interface AttributeBarProps {
  name: string;
  xp: number;
  icon: string;
}

const AttributeBar: React.FC<AttributeBarProps> = ({ name, xp, icon }) => {
  const { level, xpToNext } = calculateLevel(xp);
  const progressPercentage = getProgressPercentage(xp);

  return (
    <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="font-semibold text-white">{name}</span>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-white">LV {level}</div>
          <div className="text-xs text-gray-400">{xp} XP</div>
        </div>
      </div>
      
      <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
        <div 
          className="bg-white h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="text-xs text-gray-400 text-right">
        {xpToNext > 0 ? `${xpToNext} XP to next level` : 'MAX LEVEL'}
      </div>
    </div>
  );
};

export default AttributeBar;
