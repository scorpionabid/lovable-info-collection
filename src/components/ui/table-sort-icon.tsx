
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TableSortIconProps {
  active: boolean;
  direction: 'asc' | 'desc';
}

export const TableSortIcon: React.FC<TableSortIconProps> = ({ active, direction }) => {
  if (!active) {
    return (
      <span className="flex flex-col text-gray-400">
        <ChevronUp className="h-3 w-3" />
        <ChevronDown className="h-3 w-3 -mt-1" />
      </span>
    );
  }

  return direction === 'asc' ? (
    <ChevronUp className="h-4 w-4 text-indigo-600" />
  ) : (
    <ChevronDown className="h-4 w-4 text-indigo-600" />
  );
};
