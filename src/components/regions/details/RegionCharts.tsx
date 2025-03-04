
import { ChartCard } from "@/components/dashboard/ChartCard";
import { RegionWithStats } from '@/services/supabase/regionService';

interface RegionChartsProps {
  region: RegionWithStats;
}

export const RegionCharts = ({ region }: RegionChartsProps) => {
  // Mock data for the charts - in a real scenario, you would probably get this from an API
  const completionData = [
    { name: 'Yan', value: Math.floor(Math.random() * 35) + 65 },
    { name: 'Fev', value: Math.floor(Math.random() * 35) + 65 },
    { name: 'Mar', value: Math.floor(Math.random() * 35) + 65 },
    { name: 'Apr', value: Math.floor(Math.random() * 35) + 65 },
    { name: 'May', value: Math.floor(Math.random() * 35) + 65 },
    { name: 'İyn', value: region.completionRate },
  ];
  
  const distributionData = [
    { name: 'Məktəblər', value: region.schoolCount },
    { name: 'Sektorlar', value: region.sectorCount },
    { name: 'İstifadəçilər', value: region.userCount || 0 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard 
        title="Doldurulma Tendensiyası" 
        subtitle="Son 6 ay"
        type="bar"
        data={completionData}
        colors={['#60A5FA']}
      />
      
      <ChartCard 
        title="Region Strukturu" 
        subtitle="Məktəb, sektor və istifadəçi paylanması"
        type="pie"
        data={distributionData}
        colors={['#34D399', '#60A5FA', '#A78BFA']}
      />
    </div>
  );
};
