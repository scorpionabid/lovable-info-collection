
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RegionSectorTable } from '../RegionSectorTable';

interface Sector {
  id: string;
  name: string;
  description?: string;
  schoolCount: number;
  completionRate: number;
}

interface RegionSectorsProps {
  sectors: Sector[];
  regionId: string;
}

export const RegionSectors = ({ sectors, regionId }: RegionSectorsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-infoline-dark-blue">Region Sektorları</h2>
        <Link to="/sectors">
          <Button className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Yeni Sektor
          </Button>
        </Link>
      </div>
      
      <RegionSectorTable sectors={sectors} regionId={regionId} />
    </div>
  );
};
