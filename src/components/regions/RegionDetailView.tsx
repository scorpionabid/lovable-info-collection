
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SectorTable from "@/components/sectors/SectorTable";

// Region tipini @/lib/supabase/types faylından import edirik
import { RegionWithStats } from "@/lib/supabase/types/region";
import { Sector } from "@/lib/supabase/types/sector";

interface RegionDetailViewProps {
  region: RegionWithStats;
  sectors: Sector[];
  isLoading: boolean;
  onRefresh: () => void;
  onEdit: () => void;
}

export const RegionDetailView: React.FC<RegionDetailViewProps> = ({
  region,
  sectors,
  isLoading,
  onRefresh,
  onEdit,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Region: {region.name}</h1>
          <p className="text-gray-500">
            {region.description || "No description available"}
          </p>
          {region.code && (
            <p className="text-sm text-gray-500">Code: {region.code}</p>
          )}
        </div>
        <Button onClick={onEdit}>Edit Region</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Region Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-1">Sectors</h3>
            <p className="text-3xl font-bold">
              {region.sectorCount || region.sectors_count || 0}
            </p>
          </div>
          <div className="bg-background p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-1">Schools</h3>
            <p className="text-3xl font-bold">
              {region.schoolCount || region.schools_count || 0}
            </p>
          </div>
          <div className="bg-background p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-1">Completion Rate</h3>
            <p className="text-3xl font-bold">
              {region.completionRate || region.completion_rate || 0}%
            </p>
          </div>
        </CardContent>
      </Card>

      <SectorTable 
        sectors={sectors}
        isLoading={isLoading}
        onRefresh={onRefresh}
        regionId={region.id}
      />
    </div>
  );
};

export default RegionDetailView;
