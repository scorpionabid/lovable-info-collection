
import React from 'react';
import { RegionTableProps } from './RegionTableProps';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Pencil,
  Trash2,
  RefreshCcw
} from 'lucide-react';
import { RegionWithStats } from '@/lib/supabase/types/region';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';

export const RegionTable: React.FC<RegionTableProps> = ({
  regions,
  totalCount,
  currentPage,
  pageSize,
  setCurrentPage,
  sortColumn,
  sortDirection,
  onSortChange,
  isLoading,
  isError,
  onViewRegion,
  onEditRegion,
  onDeleteRegion,
  onRefresh
}) => {
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };
  
  const handleSort = (column: string) => {
    if (onSortChange) onSortChange(column);
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
        </div>
        <p className="mt-4 text-gray-500">Məlumatlar yüklənir...</p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Xəta baş verdi</h3>
        <p className="text-gray-500 mb-4">Regionları yükləyərkən xəta baş verdi.</p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline" className="mx-auto">
            <RefreshCcw size={16} className="mr-2" />
            Yenidən cəhd et
          </Button>
        )}
      </div>
    );
  }
  
  if (!regions || regions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Region tapılmadı</h3>
        <p className="text-gray-500 mb-4">Heç bir region məlumatı mövcud deyil.</p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline" className="mx-auto">
            <RefreshCcw size={16} className="mr-2" />
            Yenilə
          </Button>
        )}
      </div>
    );
  }
  
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                Ad {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('code')}
            >
              <div className="flex items-center">
                Kod {getSortIcon('code')}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Sektorlar
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Məktəblər
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('completionRate')}
            >
              <div className="flex items-center">
                Tamamlanma {getSortIcon('completionRate')}
              </div>
            </TableHead>
            <TableHead>Əməliyyatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {regions.map((region: RegionWithStats) => (
            <TableRow key={region.id}>
              <TableCell className="font-medium">{region.name}</TableCell>
              <TableCell>{region.code || '-'}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-50">
                  {region.sectorCount || region.sectors_count || 0}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-50">
                  {region.schoolCount || region.schools_count || 0}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-infoline-blue h-2.5 rounded-full" 
                      style={{ width: `${region.completionRate || region.completion_rate || 0}%` }}
                    ></div>
                  </div>
                  <span>{region.completionRate || region.completion_rate || 0}%</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {onViewRegion && (
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => onViewRegion(region)}>
                      <Eye size={16} />
                    </Button>
                  )}
                  {onEditRegion && (
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => onEditRegion(region)}>
                      <Pencil size={16} />
                    </Button>
                  )}
                  {onDeleteRegion && (
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-600" onClick={() => onDeleteRegion(region.id)}>
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default RegionTable;
