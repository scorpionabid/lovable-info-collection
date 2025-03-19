
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { School } from '@/services/supabase/school/types';
import { deleteSchool } from '@/services/supabase/school';
import { exportToExcel } from '@/utils/excel';

export const useSchoolActions = (refetch: () => void) => {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // Refresh school data
  const handleRefresh = () => {
    refetch();
  };

  // Handle successful school creation
  const handleCreateSuccess = () => {
    toast({
      title: "Məktəb yaradıldı",
      description: "Məktəb uğurla yaradıldı",
    });
    refetch();
  };

  // Handle export to Excel
  const handleExport = (schools: School[]) => {
    const data = schools.map(school => ({
      ID: school.id,
      Name: school.name,
      Code: school.code || '-',
      Type: school.type || '-',
      Region: school.region || '-',
      Sector: school.sector || '-',
      Address: school.address || '-',
      Director: school.director || '-',
      Email: school.email || '-',
      Phone: school.phone || '-',
      'Student Count': school.student_count || 0,
      'Teacher Count': school.teacher_count || 0,
      Status: school.status || '-',
      'Created At': new Date(school.created_at).toLocaleDateString()
    }));

    exportToExcel(data, 'schools');
  };

  // Handle import from Excel (placeholder for now)
  const handleImport = () => {
    toast({
      title: "Excel İdxalı",
      description: "Excel idxalı funksiyası hazırlanır",
    });
  };

  // Handle edit school
  const handleEditSchool = (school: School) => {
    setSelectedSchool(school);
    setIsEditModalOpen(true);
  };

  // Handle delete school
  const handleDeleteSchool = async (schoolId: string) => {
    try {
      await deleteSchool(schoolId);
      toast({
        title: "Məktəb silindi",
        description: "Məktəb uğurla silindi",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Məktəb silinərkən xəta baş verdi",
        variant: "destructive",
      });
    }
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
    handleExport,
    handleImport,
    handleEditSchool,
    handleDeleteSchool
  };
};
