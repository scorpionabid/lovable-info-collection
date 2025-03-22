
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const useUserTable = () => {
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const columns = [
    { key: 'name', label: 'Ad Soyad' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Rol' },
    { key: 'entity', label: 'Təşkilat' },
    { key: 'lastActive', label: 'Son Aktivlik' },
    { key: 'status', label: 'Status' },
  ];

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return {
    columns,
    sortColumn,
    sortDirection,
    setSortColumn,
    setSortDirection,
    handleSortChange,
    getSortIcon,
  };
};

export default useUserTable;
