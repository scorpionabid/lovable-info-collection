
import { StatCard } from "@/components/dashboard/StatCard";
import { Layers, School, Users, PieChart } from "lucide-react";
import { RegionWithStats } from '@/services/supabase/region';

interface RegionStatsProps {
  region: RegionWithStats & { userCount?: number };
}

export const RegionStats = ({ region }: RegionStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Sektorlar" 
        value={region.sectorCount || 0} 
        icon={<Layers className="h-5 w-5" />}
        color="blue"
      />
      <StatCard 
        title="Məktəblər" 
        value={region.schoolCount || 0} 
        icon={<School className="h-5 w-5" />}
        color="green"
      />
      <StatCard 
        title="İstifadəçilər" 
        value={region.userCount || 0} 
        icon={<Users className="h-5 w-5" />}
        color="purple"
      />
      <StatCard 
        title="Doldurulma faizi" 
        value={`${region.completionRate || 0}%`} 
        icon={<PieChart className="h-5 w-5" />}
        color="yellow"
        change={5}
        changeLabel="ötən aydan"
      />
    </div>
  );
};
