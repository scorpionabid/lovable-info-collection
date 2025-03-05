
import React from 'react';

interface ReportDisplayProps {
  reportData: any;
  isLoading: boolean;
}

const ReportDisplay = ({ reportData, isLoading }: ReportDisplayProps) => {
  if (isLoading) {
    return null; // ChartLoading will be rendered by the parent component
  }

  if (!reportData) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Hesabat nəticələri:</h2>
      <pre className="bg-gray-100 p-4 rounded-md overflow-auto">{JSON.stringify(reportData, null, 2)}</pre>
    </div>
  );
};

export default ReportDisplay;
