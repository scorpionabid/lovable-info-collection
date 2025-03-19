
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { School } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

const schoolFormSchema = z.object({
  name: z.string().min(3, { message: 'Məktəb adı ən azı 3 simvol olmalıdır' }),
  region_id: z.string().uuid(),
  sector_id: z.string().uuid(),
  type_id: z.string().uuid().optional(),
  address: z.string().optional(),
  code: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  director: z.string().optional().or(z.literal('')),
  student_count: z.number().int().nonnegative().optional(),
  teacher_count: z.number().int().nonnegative().optional(),
});

export type SchoolFormValues = z.infer<typeof schoolFormSchema>;

export const useSchoolForm = (school?: School, onSuccess?: () => void) => {
  const { toast } = useToast();
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);
  const [sectors, setSectors] = useState<{ id: string; name: string }[]>([]);
  const [schoolTypes, setSchoolTypes] = useState<{ id: string; name: string }[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [loadingSchoolTypes, setLoadingSchoolTypes] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(school?.region_id || null);

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: school?.name || '',
      region_id: school?.region_id || '',
      sector_id: school?.sector_id || '',
      type_id: school?.type_id || '',
      address: school?.address || '',
      code: school?.code || '',
      email: (school as any)?.email || '',
      phone: (school as any)?.phone || '',
      director: (school as any)?.director || '',
      student_count: (school as any)?.student_count || 0,
      teacher_count: (school as any)?.teacher_count || 0,
    },
  });

  // Load regions on component mount
  useEffect(() => {
    const loadRegions = async () => {
      setLoadingRegions(true);
      try {
        const { data, error } = await supabase
          .from('regions')
          .select('id, name')
          .order('name');

        if (error) throw error;
        setRegions(data || []);
      } catch (error) {
        console.error('Error loading regions:', error);
        toast({
          title: 'Xəta',
          description: 'Regionları yükləyərkən xəta baş verdi',
          variant: 'destructive',
        });
      } finally {
        setLoadingRegions(false);
      }
    };

    // Load school types using RPC function
    const loadSchoolTypes = async () => {
      setLoadingSchoolTypes(true);
      try {
        // Use the get_school_types RPC function that returns proper school types
        const { data, error } = await supabase.rpc('get_school_types');

        if (error) throw error;
        setSchoolTypes(data || []);
      } catch (error) {
        console.error('Error loading school types:', error);
        toast({
          title: 'Xəta',
          description: 'Məktəb tiplərini yükləyərkən xəta baş verdi',
          variant: 'destructive',
        });
      } finally {
        setLoadingSchoolTypes(false);
      }
    };

    loadRegions();
    loadSchoolTypes();
  }, [toast]);

  // Load sectors when region changes
  useEffect(() => {
    if (!selectedRegionId) {
      setSectors([]);
      return;
    }

    const loadSectors = async () => {
      setLoadingSectors(true);
      try {
        const { data, error } = await supabase
          .from('sectors')
          .select('id, name')
          .eq('region_id', selectedRegionId)
          .order('name');

        if (error) throw error;
        setSectors(data || []);
      } catch (error) {
        console.error('Error loading sectors:', error);
        toast({
          title: 'Xəta',
          description: 'Sektorları yükləyərkən xəta baş verdi',
          variant: 'destructive',
        });
      } finally {
        setLoadingSectors(false);
      }
    };

    loadSectors();
  }, [selectedRegionId, toast]);

  // Update form when region changes
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value;
    form.setValue('region_id', regionId);
    form.setValue('sector_id', ''); // Reset sector when region changes
    setSelectedRegionId(regionId || null);
  };

  // Handle form submission
  const onSubmit = async (values: SchoolFormValues) => {
    try {
      // Ensure required fields are present
      if (!values.name || !values.sector_id) {
        toast({
          title: 'Xəta',
          description: 'Məktəb adı və sektor məlumatlarını daxil edin',
          variant: 'destructive',
        });
        return;
      }

      // Convert string numbers to actual numbers
      const formattedValues = {
        name: values.name,
        region_id: values.region_id,
        sector_id: values.sector_id,
        type_id: values.type_id,
        address: values.address,
        code: values.code,
        email: values.email,
        phone: values.phone,
        director: values.director,
        student_count: values.student_count || null,
        teacher_count: values.teacher_count || null,
      };

      // Update or create school
      const { data, error } = school
        ? await supabase
            .from('schools')
            .update(formattedValues)
            .eq('id', school.id)
            .select()
            .single()
        : await supabase
            .from('schools')
            .insert(formattedValues)
            .select()
            .single();

      if (error) throw error;

      toast({
        title: school ? 'Məktəb yeniləndi' : 'Məktəb yaradıldı',
        description: `Məktəb məlumatları uğurla ${school ? 'yeniləndi' : 'yaradıldı'}`,
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error submitting school form:', error);
      toast({
        title: 'Xəta',
        description: error.message || 'Məktəbi yadda saxlayarkən xəta baş verdi',
        variant: 'destructive',
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    regions,
    sectors,
    schoolTypes,
    loadingRegions,
    loadingSectors,
    loadingSchoolTypes,
    handleRegionChange,
    isEditing: !!school,
  };
};
