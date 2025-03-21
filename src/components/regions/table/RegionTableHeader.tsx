
import React from 'react';
import { TableSortIcon } from '@/components/ui/table-sort-icon';

interface RegionTableHeaderProps {
  currentSort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  onSort: (field: string) => void;
}

export const RegionTableHeader: React.FC<RegionTableHeaderProps> = ({ 
  currentSort, 
  onSort 
}) => {
  const headerItems = [
    { field: 'name', label: 'Region adı', sortable: true },
    { field: 'sectorCount', label: 'Sektorlar', sortable: true },
    { field: 'schoolCount', label: 'Məktəblər', sortable: true },
    { field: 'completionRate', label: 'Tamamlanma', sortable: true },
    { field: 'status', label: 'Status', sortable: true }
  ];

  return (
    <thead className="bg-gray-50">
      <tr>
        {headerItems.map((item) => (
          <th 
            key={item.field}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            onClick={() => item.sortable && onSort(item.field)}
          >
            <div className={`flex items-center space-x-1 ${item.sortable ? 'cursor-pointer' : ''}`}>
              <span>{item.label}</span>
              {item.sortable && (
                <TableSortIcon 
                  active={currentSort.field === item.field}
                  direction={currentSort.direction}
                />
              )}
            </div>
          </th>
        ))}
        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
          Əməliyyatlar
        </th>
      </tr>
    </thead>
  );
};
