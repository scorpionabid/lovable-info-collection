
import { ArrowUp, ArrowDown } from "lucide-react";

interface RegionTableHeaderProps {
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (column: string) => void;
}

export const RegionTableHeader = ({ 
  sortColumn, 
  sortDirection, 
  onSortChange 
}: RegionTableHeaderProps) => {
  // Render sort indicator
  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-3 w-3 ml-1" /> 
      : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  return (
    <thead>
      <tr className="bg-infoline-lightest-gray border-b border-infoline-light-gray">
        <th 
          className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue cursor-pointer"
          onClick={() => onSortChange('name')}
        >
          <div className="flex items-center">
            Ad
            {renderSortIndicator('name')}
          </div>
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Təsvir</th>
        <th 
          className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue cursor-pointer"
          onClick={() => onSortChange('sector_count')}
        >
          <div className="flex items-center justify-center">
            Sektor sayı
            {renderSortIndicator('sector_count')}
          </div>
        </th>
        <th 
          className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue cursor-pointer"
          onClick={() => onSortChange('school_count')}
        >
          <div className="flex items-center justify-center">
            Məktəb sayı
            {renderSortIndicator('school_count')}
          </div>
        </th>
        <th 
          className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue cursor-pointer"
          onClick={() => onSortChange('completion_rate')}
        >
          <div className="flex items-center justify-center">
            Doldurma faizi
            {renderSortIndicator('completion_rate')}
          </div>
        </th>
        <th 
          className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue cursor-pointer"
          onClick={() => onSortChange('created_at')}
        >
          <div className="flex items-center justify-center">
            Yaradılma tarixi
            {renderSortIndicator('created_at')}
          </div>
        </th>
        <th className="px-4 py-3 text-right text-sm font-medium text-infoline-dark-blue">Əməliyyatlar</th>
      </tr>
    </thead>
  );
};
