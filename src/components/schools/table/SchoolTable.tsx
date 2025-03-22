
import React from 'react';
import { Button } from '@/components/ui/button';
import { School } from '@/lib/supabase/types/school';
import { Plus, RefreshCw } from 'lucide-react';

interface SchoolTableProps {
  schools: School[];
  isLoading: boolean;
  isError?: boolean;
  onAddSchool?: () => void;
  onRefresh?: () => void;
  regionId?: string;
  sectorId?: string;
}

const SchoolTable: React.FC<SchoolTableProps> = ({
  schools,
  isLoading,
  isError = false,
  onAddSchool,
  onRefresh,
  regionId,
  sectorId
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-infoline-blue"></div>
        <span className="ml-2">Yüklənir...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
        <p className="font-semibold">Məktəbləri yükləyərkən xəta baş verdi</p>
        <p className="mt-2">Zəhmət olmasa bir az sonra yenidən cəhd edin və ya sistem administratoru ilə əlaqə saxlayın.</p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline" className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Yenidən cəhd edin
          </Button>
        )}
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-4 text-center">
        <p className="text-gray-600 mb-2">Bu sektor üçün heç bir məktəb tapılmadı.</p>
        {onAddSchool && (
          <Button onClick={onAddSchool} className="mt-2">
            <Plus className="mr-2 h-4 w-4" />
            Yeni məktəb əlavə et
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Ad
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Kod
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Ünvan
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Əməliyyatlar
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {schools.map((school) => (
            <tr key={school.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{school.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">{school.code || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">{school.address || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="ghost" className="text-indoline-600 hover:text-indoline-900 dark:text-indoline-400 dark:hover:text-indoline-300" size="sm">
                  Bax
                </Button>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 ml-2" size="sm">
                  Redaktə et
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Add named export alongside default export
export { SchoolTable };

// Default export
export default SchoolTable;
