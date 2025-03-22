import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RegionWithStats } from '@/lib/supabase/types/region';
import { Link } from 'react-router-dom';

interface RegionTableRowProps {
  region: RegionWithStats;
  onEdit: (region: RegionWithStats) => void;
  onDelete: (regionId: string) => void;
  onView: (regionId: string) => void;
}

export const RegionTableRow: React.FC<RegionTableRowProps> = ({
  region,
  onEdit,
  onDelete,
  onView,
}) => {
  const formatCompletionRate = (rate: number): string => {
    return `${rate.toFixed(0)}%`;
  };

  const getStatusBadge = () => {
    if (region.archived) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          Archived
        </Badge>
      );
    }
    
    if (region.completionRate >= 90 || region.status === 'completed') {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          Completed
        </Badge>
      );
    } else if (region.completionRate >= 50 || region.status === 'in-progress') {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          In Progress
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          Pending
        </Badge>
      );
    }
  };

  return (
    <tr className="border-b transition-colors hover:bg-muted/20">
      <td className="py-3 px-4">{region.name}</td>
      <td className="py-3 px-4">{region.code || '-'}</td>
      <td className="py-3 px-4">{region.sectorCount}</td>
      <td className="py-3 px-4">{region.schoolCount}</td>
      <td className="py-3 px-4">{formatCompletionRate(region.completionRate)}</td>
      <td className="py-3 px-4">{getStatusBadge()}</td>
      <td className="py-3 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(region.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(region)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(region.id)} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};
