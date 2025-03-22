
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { School } from '@/lib/supabase/types/school';
import { SchoolForm } from './SchoolForm';
import { SchoolFormValues } from './types';
import * as schoolService from '@/services/supabase/school';
import { toast } from 'sonner';
import { SchoolView } from './SchoolView';

export interface SchoolModalContentProps {
  mode: 'create' | 'edit' | 'view';
  onClose: () => void;
  initialData?: School;
  regionId: string;
  onSuccess: () => void;
}

export const SchoolModalContent: React.FC<SchoolModalContentProps> = ({
  mode,
  onClose,
  initialData,
  regionId,
  onSuccess
}) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const createSchoolMutation = useMutation({
    mutationFn: schoolService.createSchool,
    onSuccess: () => {
      toast.success('Məktəb uğurla yaradıldı');
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      onClose();
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Xəta baş verdi: ${error instanceof Error ? error.message : 'Bilinməyən xəta'}`);
      setIsLoading(false);
    }
  });

  const updateSchoolMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      schoolService.updateSchool(id, data),
    onSuccess: () => {
      toast.success('Məktəb uğurla yeniləndi');
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      if (initialData?.id) {
        queryClient.invalidateQueries({ queryKey: ['school', initialData.id] });
      }
      onClose();
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Xəta baş verdi: ${error instanceof Error ? error.message : 'Bilinməyən xəta'}`);
      setIsLoading(false);
    }
  });

  const handleSubmit = (data: SchoolFormValues) => {
    setIsLoading(true);

    if (mode === 'create') {
      const schoolData = {
        name: data.name,
        code: data.code,
        region_id: data.regionId,
        sector_id: data.sectorId,
        type_id: data.type,
        address: data.address || '',
        status: data.status,
        director: '',
        email: data.contactEmail || '',
        phone: data.contactPhone || '',
        student_count: data.studentCount || 0,
        teacher_count: data.teacherCount || 0
      };
      createSchoolMutation.mutate(schoolData);
    } else if (mode === 'edit' && initialData?.id) {
      const schoolData = {
        name: data.name,
        code: data.code,
        region_id: data.regionId,
        sector_id: data.sectorId,
        type_id: data.type,
        address: data.address || '',
        status: data.status,
        director: '',
        email: data.contactEmail || '',
        phone: data.contactPhone || '',
        student_count: data.studentCount || 0,
        teacher_count: data.teacherCount || 0
      };
      updateSchoolMutation.mutate({ id: initialData.id, data: schoolData });
    }
  };

  // If view mode, render the school view component
  if (mode === 'view' && initialData) {
    return <SchoolView school={initialData} />;
  }

  // Render the form for create or edit modes
  return (
    <SchoolForm
      initialData={initialData}
      regionId={regionId}
      onSubmit={handleSubmit}
      isLoading={isLoading || createSchoolMutation.isPending || updateSchoolMutation.isPending}
      disabled={mode === 'view'}
    />
  );
};

export default SchoolModalContent;
