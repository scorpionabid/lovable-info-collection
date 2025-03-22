
import React from 'react';
import { RegionWithStats } from '@/lib/supabase/types/region';
import { RegionTableRow } from './RegionTableRow';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';

export interface RegionTableProps {
  regions: RegionWithStats[];
  isLoading: boolean;
  isError: boolean;
  onRefresh: () => void;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (column: string) => void;
  onView: (id: string) => void;
}

export const RegionTable: React.FC<RegionTableProps> = ({
  regions,
  isLoading,
  isError,
  onRefresh,
  totalCount,
  currentPage,
  pageSize,
  setCurrentPage,
  sortColumn,
  sortDirection,
  onSortChange,
  onView
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
        <p className="font-semibold">Regionları yükləyərkən xəta baş verdi</p>
        <p className="mt-2">Zəhmət olmasa bir az sonra yenidən cəhd edin və ya sistem administratoru ilə əlaqə saxlayın.</p>
        <Button onClick={onRefresh} variant="outline" className="mt-2">
          <RefreshCw className="mr-2 h-4 w-4" />
          Yenidən cəhd edin
        </Button>
      </div>
    );
  }

  if (regions.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-4 text-center">
        <p className="text-gray-600">Regionlar tapılmadı.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => onSortChange('name')}
            >
              Region
              {sortColumn === 'name' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => onSortChange('sectorCount')}
            >
              Sektorlar
              {sortColumn === 'sectorCount' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => onSortChange('schoolCount')}
            >
              Məktəblər
              {sortColumn === 'schoolCount' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => onSortChange('completionRate')}
            >
              Tamamlanma
              {sortColumn === 'completionRate' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => onSortChange('created_at')}
            >
              Yaradılıb
              {sortColumn === 'created_at' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => onSortChange('status')}
            >
              Status
              {sortColumn === 'status' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Əməliyyatlar
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {regions.map((region) => (
            <RegionTableRow
              key={region.id}
              region={region}
              onEdit={() => {}}
              onDelete={() => {}}
              onView={() => onView(region.id)}
            />
          ))}
        </tbody>
      </table>

      <div className="py-4 px-6 border-t">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default RegionTable;
