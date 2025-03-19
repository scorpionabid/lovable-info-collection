
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { getSchoolTypes } from '@/services/supabase/school/helperFunctions';
import { SchoolDatabaseRow, School } from '@/services/supabase/school/types';

// Define the form schema
const schoolFormSchema = z.object({
  name: z.string().min(3, { message: 'Məktəb adı ən azı 3 simvol olmalıdır' }),
  sector_id: z.string().min(1, { message: 'Sektor seçilməlidir' }),
  region_id: z.string().optional(),
  type_id: z.string().optional(),
  code: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email({ message: 'Düzgün email formatı daxil edin' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  director: z.string().optional(),
  student_count: z.number().min(0).optional(),
  teacher_count: z.number().min(0).optional(),
  status: z.string().optional(),
});

export type SchoolFormValues = z.infer<typeof schoolFormSchema>;

interface UseSchoolFormProps {
  mode: "create" | "edit";
  initialData?: School;
  onSuccess?: () => void;
  regionId?: string;
}

export const useSchoolForm = ({ mode, initialData, onSuccess, regionId }: UseSchoolFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);
  const [sectors, setSectors] = useState<{ id: string; name: string }[]>([]);
  const [schoolTypes, setSchoolTypes] = useState<{ id: string; name: string }[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>(regionId || '');

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      sector_id: initialData?.sector_id || '',
      region_id: initialData?.region_id || regionId || '',
      type_id: initialData?.type_id || '',
      code: initialData?.code || '',
      address: initialData?.address || '',
      email: initialData?.email || initialData?.contactEmail || '',
      phone: initialData?.phone || initialData?.contactPhone || '',
      director: initialData?.director || '',
      student_count: initialData?.student_count || initialData?.studentCount || 0,
      teacher_count: initialData?.teacher_count || initialData?.teacherCount || 0,
      status: initialData?.status || 'Aktiv',
    }
  });

  // Load regions, sectors, and school types
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch school types using RPC
        const types = await getSchoolTypes();
        setSchoolTypes(types);

        // Fetch regions
        const { data: regionsData } = await supabase.from('regions').select('id, name').order('name');
        if (regionsData) setRegions(regionsData);

        // Set the selected region to load sectors
        if (initialData?.region_id) {
          setSelectedRegion(initialData.region_id);
        } else if (regionId) {
          setSelectedRegion(regionId);
        }
      } catch (error) {
        console.error('Error loading form data:', error);
        toast.error('Məlumatlar yüklənərkən xəta baş verdi');
      }
    };
    
    loadData();
  }, [initialData, regionId]);

  // When region changes, load sectors for that region
  useEffect(() => {
    const loadSectors = async () => {
      if (!selectedRegion) {
        setSectors([]);
        return;
      }

      try {
        const { data } = await supabase
          .from('sectors')
          .select('id, name')
          .eq('region_id', selectedRegion)
          .order('name');
        
        if (data) {
          setSectors(data);
          // If there's only one sector, auto-select it
          if (data.length === 1) {
            form.setValue('sector_id', data[0].id);
          } else if (!form.getValues('sector_id')) {
            form.setValue('sector_id', '');
          }
        }
      } catch (error) {
        console.error('Error loading sectors:', error);
        toast.error('Sektorlar yüklənərkən xəta baş verdi');
      }
    };

    loadSectors();
  }, [selectedRegion, form]);

  const handleSubmit = async (values: SchoolFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const schoolData = {
        name: values.name,
        sector_id: values.sector_id,
        region_id: values.region_id || null,
        type_id: values.type_id || null,
        code: values.code || null,
        address: values.address || null,
        email: values.email || null,
        phone: values.phone || null,
        director: values.director || null,
        student_count: values.student_count || 0,
        teacher_count: values.teacher_count || 0,
        status: values.status || 'Aktiv',
      };

      let result;
      
      if (mode === "edit" && initialData) {
        // Update existing school
        result = await supabase
          .from('schools')
          .update(schoolData)
          .eq('id', initialData.id);
      } else {
        // Create new school
        result = await supabase
          .from('schools')
          .insert(schoolData);
      }

      if (result.error) {
        throw result.error;
      }

      toast.success(mode === "edit" ? 'Məktəb yeniləndi' : 'Məktəb yaradıldı');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error saving school:', error);
      setErrorMessage(error.message || 'Məktəb saxlama zamanı xəta baş verdi');
      toast.error(`Xəta: ${error.message || 'Məktəb saxlama zamanı xəta baş verdi'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    form.setValue('region_id', regionId);
  };

  return {
    form,
    isLoading,
    isSubmitting,
    errorMessage,
    regions,
    sectors,
    schoolTypes,
    handleRegionChange,
    handleSubmit
  };
};
