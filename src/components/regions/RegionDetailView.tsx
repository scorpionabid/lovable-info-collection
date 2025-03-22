
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegionWithStats } from '@/lib/supabase/types/region';
import { RegionStats } from './RegionStats';
import { SectorTable } from '../sectors/SectorTable';

interface RegionDetailViewProps {
  region: RegionWithStats;
  sectors: any[];
  isLoadingSectors: boolean;
  onRefresh: () => void;
}

export const RegionDetailView: React.FC<RegionDetailViewProps> = ({
  region,
  sectors,
  isLoadingSectors,
  onRefresh
}) => {
  // Ensure the region has all required properties with defaults if missing
  const regionWithDefaults: RegionWithStats = {
    ...region,
    // Ensure all required properties are present
    sectorCount: region.sectorCount || region.sectors_count || 0,
    schoolCount: region.schoolCount || region.schools_count || 0,
    completionRate: region.completionRate || region.completion_rate || 0,
    // Adding additional required properties from Region
    id: region.id,
    name: region.name,
    code: region.code || '',
    created_at: region.created_at,
    // Optional properties with defaults
    description: region.description || '',
    updated_at: region.updated_at,
    archived: region.archived || false
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Region: {regionWithDefaults.name}</CardTitle>
          <CardDescription>
            {regionWithDefaults.description || 'No description available'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegionStats region={regionWithDefaults} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sectors in this Region</CardTitle>
          <CardDescription>
            View and manage all sectors in {regionWithDefaults.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SectorTable 
            sectors={sectors}
            isLoading={isLoadingSectors}
            onRefresh={onRefresh}
            regionId={regionWithDefaults.id}
          />
        </CardContent>
      </Card>
    </div>
  );
};
