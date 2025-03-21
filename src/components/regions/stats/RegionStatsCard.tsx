
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useRegions } from '../hooks/useRegions';

export const RegionStatsCard: React.FC = () => {
  const { regions, isLoading, isError } = useRegions();

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Regions Statistics</CardTitle>
          <CardDescription>Loading statistics...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-48">
          <div className="animate-pulse h-40 w-40 bg-gray-200 rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Regions Statistics</CardTitle>
          <CardDescription>Error loading statistics</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-red-500">
          Failed to load region statistics
        </CardContent>
      </Card>
    );
  }

  // Calculate averages and totals
  const totalRegions = regions.length;
  const totalSectors = regions.reduce((acc, region) => 
    acc + (region.sectors_count || region.sectorCount || 0), 0);
  const totalSchools = regions.reduce((acc, region) => 
    acc + (region.schools_count || region.schoolCount || 0), 0);
  const averageCompletionRate = regions.length > 0 
    ? regions.reduce((acc, region) => 
        acc + (region.completion_rate || region.completionRate || 0), 0) / regions.length
    : 0;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Regions Statistics</CardTitle>
        <CardDescription>Overall statistics for all regions</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center">
          <div className="w-28 h-28">
            <CircularProgressbar
              value={totalRegions}
              maxValue={totalRegions || 1}
              text={`${totalRegions}`}
              styles={buildStyles({
                pathColor: `#3b82f6`,
                textColor: '#1e3a8a',
                trailColor: '#e2e8f0'
              })}
            />
          </div>
          <p className="mt-2 font-medium text-center">Total Regions</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-28 h-28">
            <CircularProgressbar
              value={totalSectors}
              maxValue={totalSectors || 1}
              text={`${totalSectors}`}
              styles={buildStyles({
                pathColor: `#10b981`,
                textColor: '#065f46',
                trailColor: '#e2e8f0'
              })}
            />
          </div>
          <p className="mt-2 font-medium text-center">Total Sectors</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-28 h-28">
            <CircularProgressbar
              value={averageCompletionRate}
              maxValue={100}
              text={`${Math.round(averageCompletionRate)}%`}
              styles={buildStyles({
                pathColor: `#f59e0b`,
                textColor: '#92400e',
                trailColor: '#e2e8f0'
              })}
            />
          </div>
          <p className="mt-2 font-medium text-center">Avg. Completion Rate</p>
        </div>
      </CardContent>
    </Card>
  );
};
