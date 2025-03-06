
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { RegionWithStats } from "@/services/supabase/regionService";
import regionService from "@/services/supabase/regionService";

export const useRegionTableActions = (onRefresh: () => void) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedRegion, setSelectedRegion] = useState<RegionWithStats | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Navigate to region details page
  const handleView = (region: RegionWithStats) => {
    navigate(`/regions/${region.id}`);
  };

  // Open edit modal
  const handleEdit = (region: RegionWithStats) => {
    setSelectedRegion(region);
    setIsEditModalOpen(true);
  };

  // Archive region
  const handleArchive = async (region: RegionWithStats) => {
    try {
      await regionService.archiveRegion(region.id);
      
      toast({
        title: "Region arxivləşdirildi",
        description: `${region.name} regionu uğurla arxivləşdirildi`,
      });
      
      // Refresh the regions list
      onRefresh();
    } catch (error) {
      console.error('Error archiving region:', error);
      toast({
        title: "Xəta baş verdi",
        description: "Region arxivləşdirilərkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  // Open export modal
  const handleExport = (region: RegionWithStats) => {
    setSelectedRegion(region);
    setIsExportModalOpen(true);
  };

  return {
    selectedRegion,
    isEditModalOpen,
    isExportModalOpen,
    setIsEditModalOpen,
    setIsExportModalOpen,
    handleView,
    handleEdit,
    handleArchive,
    handleExport
  };
};
