import React from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/lib/supabase';

// Define schema for form validation
const schoolSchema = z.object({
  name: z.string().min(3, { message: "Məktəb adı ən azı 3 simvol olmalıdır" }),
  region_id: z.string({ required_error: "Region seçilməlidir" }),
  sector_id: z.string({ required_error: "Sektor seçilməlidir" }),
  type_id: z.string().optional(),
  address: z.string().optional(),
  code: z.string().optional(),
  student_count: z.coerce.number().min(0).optional(),
  teacher_count: z.coerce.number().min(0).optional(),
  status: z.string().default('active'),
  email: z.string().email({ message: "Düzgün email formatı daxil edin" }).optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  director: z.string().optional().or(z.literal(""))
});

type SchoolFormValues = z.infer<typeof schoolSchema>;

interface SchoolFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
  defaultRegionId?: string;
  defaultSectorId?: string;
}

export const SchoolForm: React.FC<SchoolFormProps> = ({
  mode,
  initialData,
  onSuccess,
  onCancel,
  defaultRegionId,
  defaultSectorId
}) => {
  const { toast } = useToast();
  const [selectedRegion, setSelectedRegion] = React.useState(defaultRegionId || '');
  
  // Fetch regions
  const { data: regions = [] } = useSupabaseQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const { data } = await supabase.from('regions').select('id, name').order('name');
      return data || [];
    }
  });
  
  // Fetch sectors based on selected region
  const { data: sectors = [] } = useSupabaseQuery({
    queryKey: ['sectors', selectedRegion],
    queryFn: async () => {
      if (!selectedRegion) return [];
      const { data } = await supabase.from('sectors')
        .select('id, name')
        .eq('region_id', selectedRegion)
        .order('name');
      return data || [];
    },
    enabled: !!selectedRegion
  });
  
  // Fetch school types
  const { data: schoolTypes = [] } = useSupabaseQuery({
    queryKey: ['schoolTypes'],
    queryFn: async () => {
      const { data } = await supabase.from('school_types').select('id, name').order('name');
      return data || [];
    }
  });
  
  // Initialize form with default values or data from props
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: initialData?.name || '',
      region_id: initialData?.region_id || defaultRegionId || '',
      sector_id: initialData?.sector_id || defaultSectorId || '',
      type_id: initialData?.type_id || '',
      address: initialData?.address || '',
      code: initialData?.code || '',
      student_count: initialData?.student_count || 0,
      teacher_count: initialData?.teacher_count || 0,
      status: initialData?.status || 'active',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      director: initialData?.director || ''
    }
  });
  
  // Set selected region when form values change
  React.useEffect(() => {
    const regionId = form.getValues('region_id');
    if (regionId) {
      setSelectedRegion(regionId);
    }
  }, [form.getValues('region_id')]);
  
  // Handle region change
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    form.setValue('region_id', value);
    form.setValue('sector_id', ''); // Reset sector when region changes
  };
  
  // Handle form submission
  const onSubmit = async (values: SchoolFormValues) => {
    try {
      // In a real implementation, this would call your API
      console.log('School form values:', values);
      
      // Mock submit
      setTimeout(() => {
        toast({
          title: mode === 'create' ? 'Məktəb yaradıldı' : 'Məktəb yeniləndi',
          description: `${values.name} uğurla ${mode === 'create' ? 'yaradıldı' : 'yeniləndi'}`,
        });
        onSuccess();
      }, 500);
    } catch (error) {
      console.error('Error submitting school form:', error);
      toast({
        title: 'Xəta baş verdi',
        description: 'Məktəb məlumatları saxlanılmadı',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Məktəb adı</FormLabel>
              <FormControl>
                <Input placeholder="Məktəb adını daxil edin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="region_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={handleRegionChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Region seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sector_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sektor</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedRegion || sectors.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sektor seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Additional form fields would go here */}
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Ləğv et
          </Button>
          <Button type="submit">
            {mode === 'create' ? 'Yarat' : 'Yenilə'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
