
import React from 'react';
import { Sector, SectorWithStats } from '@/lib/supabase/types';
import { School } from '@/lib/supabase/types/school';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SchoolTable from '@/components/schools/table/SchoolTable';

interface SectorDetailViewProps {
  sector: Sector;
  schools: School[];
  isLoadingSchools: boolean;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (value: boolean) => void;
  onRefresh: () => void;
}

export const SectorDetailView: React.FC<SectorDetailViewProps> = ({
  sector,
  schools,
  isLoadingSchools,
  isEditModalOpen,
  setIsEditModalOpen,
  onRefresh
}) => {
  // Convert Sector to SectorWithStats and ensure required properties
  const sectorWithStats: SectorWithStats = {
    ...sector,
    // Add required stats properties
    schoolCount: schools?.length || 0,
    completionRate: 0, // Calculate or use a default
    // Make sure we meet the required props from Sector
    id: sector.id,
    name: sector.name,
    region_id: sector.region_id,
    created_at: sector.created_at,
    // Optional properties
    code: sector.code || '',
    description: sector.description || '',
    archived: sector.archived || false,
    updated_at: sector.updated_at
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sector: {sectorWithStats.name}</h1>
          <p className="text-gray-500">
            {sectorWithStats.description || 'No description available'}
          </p>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>Edit Sector</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sector Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="bg-background p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-1">Schools</h3>
            <p className="text-3xl font-bold">{sectorWithStats.schoolCount}</p>
          </div>
          <div className="bg-background p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-1">Completion Rate</h3>
            <p className="text-3xl font-bold">{sectorWithStats.completionRate}%</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schools in this Sector</CardTitle>
        </CardHeader>
        <CardContent>
          <SchoolTable 
            schools={schools}
            isLoading={isLoadingSchools}
            onRefresh={onRefresh}
            sectorId={sectorWithStats.id}
          />
        </CardContent>
      </Card>
    </div>
  );
};
