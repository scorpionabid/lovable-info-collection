
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
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant={region.status ? "success" : "secondary"}>
          {region.status ? "Aktiv" : "Deaktiv"}
        </Badge>
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
