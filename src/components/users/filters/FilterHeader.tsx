
import React from 'react';

export interface FilterHeaderProps {
  title: string; // Add title prop
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({ title }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
  );
};
