
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Using a stored procedure (RPC) to get school types
const fetchSchoolTypes = async () => {
  try {
    const { data, error } = await supabase.rpc('get_school_types');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching school types:', error);
    return [];
  }
};

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
});

export type SchoolFormValues = z.infer<typeof schoolFormSchema>;

export const useSchoolForm = (schoolId?: string, onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);
  const [sectors, setSectors] = useState<{ id: string; name: string }[]>([]);
  const [schoolTypes, setSchoolTypes] = useState<{ id: string; name: string }[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: '',
      sector_id: '',
      region_id: '',
      type_id: '',
      code: '',
      address: '',
      email: '',
      phone: '',
      director: '',
      student_count: 0,
      teacher_count: 0,
    }
  });

  // Load regions, sectors, and school types
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch school types using RPC
        const types = await fetchSchoolTypes();
        setSchoolTypes(types);

        // Fetch regions
        const { data: regionsData } = await supabase.from('regions').select('id, name').order('name');
        if (regionsData) setRegions(regionsData);

        // If editing, fetch the school data
        if (schoolId) {
          const { data: school } = await supabase
            .from('schools')
            .select(`
              id, name, region_id, sector_id, type_id, code, address,
              email, phone, director, student_count, teacher_count,
              regions(id, name),
              sectors(id, name),
              school_types(id, name)
            `)
            .eq('id', schoolId)
            .single();

          if (school) {
            // Set form values
            form.reset({
              name: school.name,
              sector_id: school.sector_id,
              region_id: school.region_id || '',
              type_id: school.type_id || '',
              code: school.code || '',
              address: school.address || '',
              email: school.email || '',
              phone: school.phone || '',
              director: school.director || '',
              student_count: school.student_count || 0,
              teacher_count: school.teacher_count || 0,
            });

            // Set the selected region to load sectors
            if (school.region_id) {
              setSelectedRegion(school.region_id);
            }
          }
        }
      } catch (error) {
        console.error('Error loading form data:', error);
        toast.error('Məlumatlar yüklənərkən xəta baş verdi');
      }
    };
    
    loadData();
  }, [schoolId, form]);

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

  const onSubmit = async (values: SchoolFormValues) => {
    setIsLoading(true);

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
      };

      let result;
      
      if (schoolId) {
        // Update existing school
        result = await supabase
          .from('schools')
          .update(schoolData)
          .eq('id', schoolId);
      } else {
        // Create new school
        result = await supabase
          .from('schools')
          .insert(schoolData);
      }

      if (result.error) {
        throw result.error;
      }

      toast.success(schoolId ? 'Məktəb yeniləndi' : 'Məktəb yaradıldı');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error saving school:', error);
      toast.error(`Xəta: ${error.message || 'Məktəb saxlama zamanı xəta baş verdi'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    form.setValue('region_id', regionId);
  };

  return {
    form,
    onSubmit,
    isLoading,
    regions,
    sectors,
    schoolTypes,
    handleRegionChange,
  };
};
