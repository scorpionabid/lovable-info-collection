
import React from 'react';
import { RegionWithStats } from '@/lib/supabase/types/region';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface RegionTableRowProps {
  region: RegionWithStats;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export const RegionTableRow: React.FC<RegionTableRowProps> = ({
  region,
  onEdit,
  onDelete,
  onView
}) => {
  // Get color for the completion rate
  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-100 text-green-800';
    if (rate >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Get label for status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'inactive':
        return 'Deaktiv';
      case 'archived':
        return 'Arxivlənmiş';
      default:
        return status;
    }
  };

  // Get color for status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusText = region.status || 'active';
  const isArchived = region.archived || false;
  const finalStatus = isArchived ? 'archived' : statusText;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900 dark:text-white">
          {region.name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {region.code || '-'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {region.sectorCount || region.sectors_count || 0}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {region.schoolCount || region.schools_count || 0}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge 
          className={getCompletionRateColor(region.completionRate || region.completion_rate || 0)}
        >
          {region.completionRate || region.completion_rate || 0}%
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {region.created_at ? formatDate(region.created_at) : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge 
          className={getStatusColor(finalStatus)}
        >
          {getStatusLabel(finalStatus)}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Button onClick={onView} variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
          <Eye className="w-4 h-4" />
        </Button>
        <Button onClick={onEdit} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
          <Pencil className="w-4 h-4" />
        </Button>
        <Button onClick={onDelete} variant="ghost" size="sm" className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
};

export default RegionTableRow;
