
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Archive, MoreHorizontal, Download } from "lucide-react";
import { RegionWithStats } from "@/services/supabase/region";

interface RegionTableRowProps {
  region: RegionWithStats;
  onView: (region: RegionWithStats) => void;
  onEdit: (region: RegionWithStats) => void;
  onArchive: (region: RegionWithStats) => void;
  onExport: (region: RegionWithStats) => void;
}

export const RegionTableRow = ({ 
  region, 
  onView, 
  onEdit, 
  onArchive, 
  onExport 
}: RegionTableRowProps) => {
  return (
    <tr 
      className="border-b border-infoline-light-gray hover:bg-infoline-lightest-gray transition-colors cursor-pointer"
      onClick={() => onView(region)}
    >
      <td className="px-4 py-3 text-sm font-medium text-infoline-dark-blue">{region.name}</td>
      <td className="px-4 py-3 text-sm text-infoline-dark-gray">{region.description}</td>
      <td className="px-4 py-3 text-sm text-center text-infoline-dark-gray">{region.sectors_count || region.sectorCount || 0}</td>
      <td className="px-4 py-3 text-sm text-center text-infoline-dark-gray">{region.schools_count || region.schoolCount || 0}</td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center">
          <div className="w-16 bg-gray-200 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full" 
              style={{ 
                width: `${region.completion_rate || region.completionRate || 0}%`,
                backgroundColor: (region.completion_rate || region.completionRate || 0) > 80 ? '#10B981' : 
                               (region.completion_rate || region.completionRate || 0) > 50 ? '#F59E0B' : '#EF4444'
              }}
            ></div>
          </div>
          <span className="ml-2 text-sm text-infoline-dark-gray">{region.completion_rate || region.completionRate || 0}%</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-center text-infoline-dark-gray">
        {new Date(region.created_at).toLocaleDateString('az-AZ')}
      </td>
      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(region)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Baxış</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(region)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Redaktə et</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onArchive(region)}>
              <Archive className="mr-2 h-4 w-4" />
              <span>Arxivləşdir</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport(region)}>
              <Download className="mr-2 h-4 w-4" />
              <span>İxrac et</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};
