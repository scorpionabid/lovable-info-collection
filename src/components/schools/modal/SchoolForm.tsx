
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SchoolWithStats } from '@/services/supabase/school/types';
import * as schoolService from '@/services/supabase/school';

// Define the form schema
const schoolSchema = z.object({
  name: z.string().min(3, { message: 'Məktəb adı ən azı 3 simvol olmalıdır' }),
  code: z.string().optional(),
  region_id: z.string().optional(),
  sector_id: z.string().min(1, { message: 'Sektor seçilməlidir' }),
  type_id: z.string().optional(),
  address: z.string().optional(),
  status: z.string().optional(),
  student_count: z.number().min(0).optional(),
  teacher_count: z.number().min(0).optional(),
  director: z.string().optional(),
  email: z.string().email({ message: 'Düzgün email formatı daxil edin' }).optional().or(z.literal('')),
  phone: z.string().optional()
});

export type SchoolFormValues = z.infer<typeof schoolSchema>;

export interface SchoolFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  onSuccess: () => void;
  onCancel?: () => void;
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
  // Get regions for dropdown
  const regionsQuery = useQuery({
    queryKey: ['regions-dropdown'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regions')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      return data || [];
    }
  });

  // Get sectors for dropdown
  const sectorsQuery = useQuery({
    queryKey: ['sectors-dropdown', initialData?.region_id || defaultRegionId],
    queryFn: async () => {
      const regionId = initialData?.region_id || defaultRegionId;
      let query = supabase
        .from('sectors')
        .select('id, name')
        .order('name');
        
      if (regionId) {
        query = query.eq('region_id', regionId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!initialData?.region_id || !!defaultRegionId
  });

  // Get school types for dropdown
  const typesQuery = useQuery({
    queryKey: ['school-types-dropdown'],
    queryFn: async () => {
      // Use RPC function if available, otherwise fallback to direct query
      try {
        const { data, error } = await supabase.rpc('get_school_types');
        if (error) throw error;
        return data || [];
      } catch (e) {
        // Fallback to direct query
        const { data, error } = await supabase
          .from('school_types')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        return data || [];
      }
    }
  });

  // Form setup with react-hook-form and zod validation
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      region_id: initialData?.region_id || defaultRegionId || '',
      sector_id: initialData?.sector_id || defaultSectorId || '',
      type_id: initialData?.type_id || '',
      address: initialData?.address || '',
      status: initialData?.status || 'active',
      student_count: initialData?.student_count || initialData?.studentCount || 0,
      teacher_count: initialData?.teacher_count || initialData?.teacherCount || 0,
      director: initialData?.director || '',
      email: initialData?.email || '',
      phone: initialData?.phone || ''
    }
  });

  // Create school mutation
  const createSchoolMutation = useMutation({
    mutationFn: async (data: SchoolFormValues) => {
      return await schoolService.createSchool(data);
    },
    onSuccess: () => {
      toast.success('Məktəb uğurla yaradıldı');
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Xəta: ${error instanceof Error ? error.message : 'Bilinməyən xəta'}`);
    }
  });

  // Update school mutation
  const updateSchoolMutation = useMutation({
    mutationFn: async (data: SchoolFormValues) => {
      if (!initialData?.id) throw new Error('Məktəb ID-i mövcud deyil');
      return await schoolService.updateSchool(initialData.id, data);
    },
    onSuccess: () => {
      toast.success('Məktəb məlumatları uğurla yeniləndi');
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Xəta: ${error instanceof Error ? error.message : 'Bilinməyən xəta'}`);
    }
  });

  // Handle form submission
  const onSubmit = (values: SchoolFormValues) => {
    if (mode === 'create') {
      createSchoolMutation.mutate(values);
    } else {
      updateSchoolMutation.mutate(values);
    }
  };

  // Handle region change to filter sectors
  const handleRegionChange = (regionId: string) => {
    form.setValue('region_id', regionId);
    form.setValue('sector_id', ''); // Reset sector when region changes
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Məktəbin adı*</FormLabel>
                <FormControl>
                  <Input placeholder="Məktəbin adını daxil edin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Məktəb kodu</FormLabel>
                <FormControl>
                  <Input placeholder="Kod daxil edin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <Select 
                  onValueChange={handleRegionChange} 
                  value={field.value}
                  disabled={regionsQuery.isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Region seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {regionsQuery.data?.map((region) => (
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
                <FormLabel>Sektor*</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={sectorsQuery.isLoading || !form.getValues('region_id')}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sektor seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sectorsQuery.data?.map((sector) => (
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

          <FormField
            control={form.control}
            name="type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Məktəb növü</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={typesQuery.isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Növ seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {typesQuery.data?.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Status seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Aktiv</SelectItem>
                    <SelectItem value="inactive">Deaktiv</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="student_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şagird sayı</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teacher_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Müəllim sayı</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="director"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Direktor</FormLabel>
                <FormControl>
                  <Input placeholder="Direktor adı" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@domain.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input placeholder="+994 XX XXX XX XX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ünvan</FormLabel>
              <FormControl>
                <Textarea placeholder="Məktəbin ünvanı" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              İmtina et
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={createSchoolMutation.isPending || updateSchoolMutation.isPending}
          >
            {mode === 'create' ? 'Yarat' : 'Yenilə'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
