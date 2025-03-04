
import React from 'react';

interface ChartLoadingProps {
  height?: number;
}

export const ChartLoading = ({ height = 300 }: ChartLoadingProps) => {
  return (
    <div className="flex justify-center items-center" style={{ height: `${height}px` }}>
      <div className="animate-spin h-8 w-8 border-4 border-infoline-blue border-opacity-50 border-t-infoline-blue rounded-full"></div>
    </div>
  );
};
