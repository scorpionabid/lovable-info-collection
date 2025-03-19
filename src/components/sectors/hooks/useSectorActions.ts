
import { useState } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { SectorWithStats } from '@/services/supabase/sector/types';

export const useSectorActions = (refetch: () => void) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleRefresh = () => {
    refetch();
    toast.success('Sektorlar yeniləndi');
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
    toast.success('Sektor uğurla yaradıldı');
  };

  const handleExport = (data: SectorWithStats[]) => {
    try {
      if (!data || data.length === 0) {
        toast.error('Eksport etmək üçün sektor tapılmadı');
        return;
      }

      // Prepare data for export
      const exportData = data.map(sector => ({
        'Ad': sector.name,
        'Region': sector.regionName || '',
        'Təsvir': sector.description || '',
        'Məktəb sayı': sector.schoolCount || sector.schools_count || 0,
        'Tamamlanma faizi': `${(sector.completionRate || sector.completion_rate || 0).toFixed(2)}%`,
        'Yaradılma tarixi': new Date(sector.created_at).toLocaleDateString()
      }));

      // Create a worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Create a workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sektorlar');
      
      // Generate the file and trigger download
      XLSX.writeFile(wb, 'Sektorlar.xlsx');
      
      toast.success('Sektorlar uğurla eksport edildi');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Eksport zamanı xəta baş verdi');
    }
  };

  const handleImport = () => {
    setIsImportModalOpen(true);
    // This would typically open an import modal
    // For now, we'll just show a toast
    toast.info('Import funksionallığı hazırlanır');
  };

  return {
    isCreateModalOpen,
    setIsCreateModalOpen,
    isImportModalOpen,
    setIsImportModalOpen,
    handleRefresh,
    handleCreateSuccess,
    handleExport,
    handleImport
  };
};
