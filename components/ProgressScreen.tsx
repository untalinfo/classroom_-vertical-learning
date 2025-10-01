
import React from 'react';
import type { Progress } from '../types';

interface ProgressScreenProps {
    progress: Progress[];
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({ progress }) => {
  return (
    <div className="p-4 h-full overflow-y-auto bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-white">My Progress</h1>
       <div className="space-y-4">
        {progress.map((p, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-white">{p.courseTitle}</h2>
                <span className="font-bold text-blue-400">{p.completionPercentage}%</span>
            </div>
            <p className="text-gray-400 text-sm mb-2">{p.totalModules} modules</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${p.completionPercentage}%`}}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressScreen;
