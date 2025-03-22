
import React, { useState } from 'react';
import { Sector } from '@/lib/supabase/types/sector'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { PlusIcon, RefreshCwIcon, PencilIcon, EyeIcon, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface SectorTableProps {
  sectors: Sector[];
  isLoading: boolean;
  onRefresh: () => void;
  regionId?: string;
}

export const SectorTable: React.FC<SectorTableProps> = ({ 
  sectors, 
  isLoading, 
  onRefresh,
  regionId 
}) => {
  const navigate = useNavigate();

  const handleAddSector = () => {
    // You would implement this with a modal or navigation
    toast("Add sector functionality not yet implemented");
  };

  const handleEditSector = (id: string) => {
    navigate(`/sectors/${id}/edit`);
  };

  const handleViewSector = (id: string) => {
    navigate(`/sectors/${id}`);
  };

  const handleDeleteSector = (id: string) => {
    // This would need to be implemented with your deletion logic
    toast("Delete sector functionality not yet implemented");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sectors</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={handleAddSector}
            disabled={isLoading}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Sector
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="w-full h-64 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
          </div>
        ) : sectors.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No sectors found.</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={handleAddSector}
            >
              Add your first sector
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Schools</TableHead>
                  <TableHead>Completion Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectors.map(sector => (
                  <TableRow key={sector.id}>
                    <TableCell className="font-medium">{sector.name}</TableCell>
                    <TableCell>{sector.code || '-'}</TableCell>
                    <TableCell>{sector.regionName || sector.region || '-'}</TableCell>
                    <TableCell>{sector.schoolCount || sector.schools_count || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{ 
                              width: `${sector.completionRate || sector.completion_rate || 0}%`,
                              backgroundColor: (sector.completionRate || sector.completion_rate || 0) > 80 ? '#10B981' : (sector.completionRate || sector.completion_rate || 0) > 50 ? '#F59E0B' : '#EF4444'
                            }}
                          ></div>
                        </div>
                        <span className="text-xs">{sector.completionRate || sector.completion_rate || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <span className="sr-only">Open menu</span>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM7.5 13.625C8.12132 13.625 8.625 13.1213 8.625 12.5C8.625 11.8787 8.12132 11.375 7.5 11.375C6.87868 11.375 6.375 11.8787 6.375 12.5C6.375 13.1213 6.87868 13.625 7.5 13.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewSector(sector.id)}>
                            <EyeIcon className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditSector(sector.id)}>
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteSector(sector.id)}
                            className="text-red-600"
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SectorTable;
