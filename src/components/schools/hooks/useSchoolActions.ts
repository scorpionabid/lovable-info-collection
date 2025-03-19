
import { useState } from 'react';
import { School, SchoolWithStats } from '@/services/supabase/school/types';
import { deleteSchool } from '@/services/supabase/school';
import { useToast } from '@/hooks/use-toast';

export const useSchoolActions = (refetch: () => void) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const { toast } = useToast();

  const handleRefresh = () => {
    refetch();
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
    toast({
      title: "Məktəb yaradıldı",
      description: "Məktəb uğurla əlavə edildi",
    });
  };

  const handleExport = (schools: School[]) => {
    // Implementation for exporting schools to Excel
    console.log("Exporting schools:", schools);
  };

  const handleImport = () => {
    // Implementation for importing schools from Excel
    console.log("Importing schools");
  };

  const handleEditSchool = (school: School) => {
    setSelectedSchool(school);
    setIsEditModalOpen(true);
  };

  // Updated to accept a SchoolWithStats parameter
  const handleDeleteSchool = async (school: School) => {
    try {
      if (!school || !school.id) {
        throw new Error("Invalid school data");
      }
      
      await deleteSchool(school.id);
      toast({
        title: "Məktəb silindi",
        description: `${school.name} uğurla silindi`,
      });
      refetch();
    } catch (error) {
      console.error("Error deleting school:", error);
      toast({
        title: "Xəta baş verdi",
        description: "Məktəb silinə bilmədi",
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
    handleRefresh,
    handleCreateSuccess,
    handleExport,
    handleImport,
    handleEditSchool,
    handleDeleteSchool
  };
};
