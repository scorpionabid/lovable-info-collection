
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';
import { fileExport } from "@/utils/fileExport";
import { RegionWithStats } from "@/services/supabase/region";

export const useRegionActions = (refetch: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Məlumatlar yeniləndi",
      description: "Region siyahısı yeniləndi",
    });
  };

  const handleExport = (regionsData?: { data: RegionWithStats[], count: number }) => {
    if (!regionsData || regionsData.data.length === 0) {
      toast({
        title: "İxrac ediləcək məlumat yoxdur",
        description: "Region siyahısında məlumat tapılmadı",
        variant: "destructive",
      });
      return;
    }

    const exportData = regionsData.data.map(region => ({
      'Ad': region.name,
      'Kod': region.code || '',
      'Təsvir': region.description || '',
      'Sektor sayı': region.sectorCount || 0,
      'Məktəb sayı': region.schoolCount || 0,
      'Doldurma faizi': `${region.completionRate || 0}%`,
      'Yaradılma tarixi': new Date(region.created_at).toLocaleDateString('az-AZ')
    }));

    fileExport({
      data: exportData,
      fileName: 'Regionlar',
      fileType: 'xlsx'
    });

    toast({
      title: "İxrac əməliyyatı uğurla tamamlandı",
      description: "Məlumatlar Excel formatında ixrac edildi",
    });
  };

  const handleImport = () => {
    toast({
      title: "İdxal funksiyası",
      description: "Bu funksiya hazırda işləmə mərhələsindədir",
    });
  };
  
  const handleCreateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['regions'] });
    toast({
      title: "Region uğurla yaradıldı",
      description: "Yeni region məlumatları sistemə əlavə edildi",
    });
  };

  return {
    isCreateModalOpen,
    setIsCreateModalOpen,
    handleRefresh,
    handleExport,
    handleImport,
    handleCreateSuccess
  };
};
