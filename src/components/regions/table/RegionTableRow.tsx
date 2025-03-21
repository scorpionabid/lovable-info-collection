import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RegionWithStats } from '@/supabase/types';
import { Link } from 'react-router-dom';

interface RegionTableRowProps {
  region: RegionWithStats;
  onEdit: () => void;
  onDelete: () => void;
}

export const RegionTableRow: React.FC<RegionTableRowProps> = ({ region, onEdit, onDelete }) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          <Link to={`/regions/${region.id}`} className="hover:text-indigo-600 hover:underline">
            {region.name}
          </Link>
        </div>
        {region.code && <div className="text-xs text-gray-500">{region.code}</div>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatNumber(region.sectorCount)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatNumber(region.schoolCount)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-24 bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${region.completionRate}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">{region.completionRate}%</div>
      </td>
      <td className="px-4 py-2">
        <div className="flex justify-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${region.archived ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
            {region.archived ? 'Archived' : 'Active'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Əməliyyatlar</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onEdit()}>
              <Edit className="mr-2 h-4 w-4" />
              Redaktə et
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDelete()}>
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};
