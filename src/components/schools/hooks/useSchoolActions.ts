
import { useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { School } from '@/services/supabase/school/types';
import * as XLSX from 'xlsx';

export const useSchoolActions = (refetch: () => void) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    refetch();
    toast.success('Məlumatlar yeniləndi');
  };

  const handleCreateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['schools'] });
    setIsCreateModalOpen(false);
    toast.success('Məktəb uğurla yaradıldı');
  };

  const handleUpdateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['schools'] });
    setIsEditModalOpen(false);
    setSelectedSchool(null);
    toast.success('Məktəb uğurla yeniləndi');
  };

  const handleEdit = (school: School) => {
    setSelectedSchool(school);
    setIsEditModalOpen(true);
  };

  const handleExport = (schools: School[]) => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        schools.map(school => ({
          'Ad': school.name,
          'Region': school.region?.name || 'N/A',
          'Sektor': school.sector?.name || 'N/A',
          'Tip': school.type || 'N/A',
          'Şagird sayı': school.student_count,
          'Müəllim sayı': school.teacher_count,
          'Status': school.status,
          'Direktor': school.director || 'N/A',
          'Ünvan': school.address || 'N/A',
          'Telefon': school.phone || 'N/A',
          'Email': school.email || 'N/A'
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Məktəblər');
      XLSX.writeFile(workbook, 'məktəblər.xlsx');
      
      toast.success('Məlumatlar uğurla export edildi');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Export zamanı xəta baş verdi');
    }
  };

  const handleImport = () => {
    // This would typically handle file upload and processing
    toast.info('Import funksionallığı hazırlanır');
  };

  return {
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedSchool,
    setSelectedSchool,
    handleRefresh,
    handleCreateSuccess,
    handleUpdateSuccess,
    handleEdit,
    handleExport,
    handleImport
  };
};
