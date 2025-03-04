
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Download } from "lucide-react";
import { RegionWithStats } from '@/services/supabase/regionService';

interface RegionHeaderProps {
  region: RegionWithStats;
  onEdit: () => void;
  onExport: () => void;
}

export const RegionHeader = ({ region, onEdit, onExport }: RegionHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/regions')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-infoline-dark-blue">{region.name}</h1>
        </div>
        <p className="text-infoline-dark-gray mt-1 ml-10">{region.description}</p>
      </div>
      
      <div className="flex gap-2 ml-10 sm:ml-0">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          İxrac et
        </Button>
        <Button 
          className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          Redaktə et
        </Button>
      </div>
    </div>
  );
};
