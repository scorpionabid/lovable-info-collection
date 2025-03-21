
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getSchoolStats } from '@/services/supabase/school/queries/statsQueries';
import { Loader2 } from 'lucide-react';

interface SchoolStatsProps {
  schoolId: string;
}

const SchoolStats: React.FC<SchoolStatsProps> = ({ schoolId }) => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['schoolStats', schoolId],
    queryFn: () => getSchoolStats(schoolId),
    enabled: !!schoolId
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Məktəb Statistikası</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-infoline-blue" />
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Məktəb Statistikası</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Statistika məlumatları yüklənərkən xəta baş verdi.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Məktəb Statistikası</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm text-gray-500">Şagird sayı</h3>
            <p className="text-2xl font-bold text-blue-700">{stats.total_students}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm text-gray-500">Müəllim sayı</h3>
            <p className="text-2xl font-bold text-green-700">{stats.total_teachers}</p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm text-gray-500">Tamamlanma faizi</h3>
            <p className="text-2xl font-bold text-amber-700">{stats.completion_rate}%</p>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          Son yenilənmə: {new Date(stats.lastUpdate).toLocaleString('az-AZ')}
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolStats;
