import React from 'react';

const ActivityRects = ({ value, label, subLabel, color = '#4CAF50' }) => {
  return (
    <div className="bg-white rounded-lg p-3 sm:p-5 shadow-md border min-h-[80px] sm:min-h-[100px]">
      <div className="flex items-baseline gap-1 flex-wrap">
        <span className="text-xl sm:text-2xl font-bold text-gray-800">{value}</span>
        {subLabel && (
          <span style={{ color: color }} className="text-xs sm:text-sm">
            {subLabel}
          </span>
        )}
      </div>
      <div className="text-[10px] sm:text-xs text-gray-600 uppercase mt-1">{label}</div>
    </div>
  );
};

export default ActivityRects;
