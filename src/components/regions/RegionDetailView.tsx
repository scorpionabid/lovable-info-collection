
import { useState } from 'react';
import { RegionWithStats } from '@/services/supabase/regionService';
import { RegionModal } from './RegionModal';
import { RegionExportModal } from './RegionExportModal';
import { useToast } from '@/hooks/use-toast';
import { RegionHeader } from './details/RegionHeader';
import { RegionStats } from './details/RegionStats';
import { RegionCharts } from './details/RegionCharts';
import { RegionSectors } from './details/RegionSectors';
import { RegionAdmins } from './details/RegionAdmins';

interface Sector {
  id: string;
  name: string;
  description?: string;
  schoolCount: number;
  completionRate: number;
}

interface RegionDetailProps {
  region: RegionWithStats & { userCount?: number };
  sectors: Sector[];
  onRegionUpdated: () => void;
}

export const RegionDetailView = ({ region, sectors, onRegionUpdated }: RegionDetailProps) => {
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Handle edit success
  const handleEditSuccess = () => {
    onRegionUpdated();
    setIsEditModalOpen(false);
    toast({
      title: "Region yeniləndi",
      description: "Region məlumatları uğurla yeniləndi",
    });
  };

  return (
    <div className="space-y-6">
      <RegionHeader 
        region={region} 
        onEdit={() => setIsEditModalOpen(true)} 
        onExport={() => setIsExportModalOpen(true)} 
      />
      
      <RegionStats region={region} />
      
      <RegionCharts region={region} />
      
      <RegionSectors sectors={sectors} regionId={region.id} />
      
      <RegionAdmins />
      
      <RegionModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        mode="edit"
        region={region}
        onSuccess={handleEditSuccess}
      />
      
      <RegionExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        region={region}
      />
    </div>
  );
};
