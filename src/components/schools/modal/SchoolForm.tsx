
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { School } from '@/lib/supabase/types/school';
import { useSchoolTypesQuery } from '@/hooks/useSchoolTypesQuery';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createSchool, updateSchool } from '@/supabase';

// Form schema using Zod
const schoolFormSchema = z.object({
  name: z.string().min(2, 'Məktəb adı ən azı 2 simvol olmalıdır'),
  code: z.string().min(1, 'Kod daxil edin'),
  region_id: z.string().uuid('Region seçin'),
  sector_id: z.string().uuid('Sektor seçin'),
  type_id: z.string().uuid('Məktəb növünü seçin'),
  address: z.string().optional(),
  director: z.string().optional(),
  email: z.string().email('Düzgün email daxil edin').optional().or(z.literal('')),
  phone: z.string().optional(),
  student_count: z.number().nonnegative().optional(),
  teacher_count: z.number().nonnegative().optional(),
});

type SchoolFormValues = z.infer<typeof schoolFormSchema>;

interface SchoolFormProps {
  mode: 'create' | 'edit';
  initialData?: School | null;
  isReadOnly?: boolean;
  onSave: (data: any) => void;
  sectorId?: string;
  regionId?: string;
}

const SchoolForm: React.FC<SchoolFormProps> = ({
  mode,
  initialData,
  isReadOnly = false,
  onSave,
  sectorId,
  regionId
}) => {
  // Fetch school types
  const { data: schoolTypesData, isLoading: isLoadingSchoolTypes } = useSchoolTypesQuery();
  const schoolTypes = schoolTypesData || [];

  // Create form with react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      region_id: initialData?.region_id || regionId || '',
      sector_id: initialData?.sector_id || sectorId || '',
      type_id: initialData?.type_id || '',
      address: initialData?.address || '',
      director: initialData?.director || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      student_count: initialData?.student_count || 0,
      teacher_count: initialData?.teacher_count || 0,
    }
  });

  const onSubmit = async (data: SchoolFormValues) => {
    try {
      if (mode === 'create') {
        await createSchool(data);
      } else {
        if (initialData?.id) {
          await updateSchool(initialData.id, data);
        }
      }
      onSave(data);
    } catch (error) {
      console.error('Error saving school:', error);
    }
  };

  return (
    <form id="school-form" onSubmit={handleSubmit(onSubmit)}>
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Məktəb adı *</Label>
            <Input
              id="name"
              {...register('name')}
              disabled={isReadOnly}
              error={errors.name?.message}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="code">Kod *</Label>
            <Input
              id="code"
              {...register('code')}
              disabled={isReadOnly}
              error={errors.code?.message}
            />
            {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="type_id">Məktəb növü *</Label>
            <Select disabled={isReadOnly} defaultValue={initialData?.type_id}>
              <SelectTrigger>
                <SelectValue placeholder="Məktəb növünü seçin" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingSchoolTypes ? (
                  <SelectItem value="loading">Yüklənir...</SelectItem>
                ) : (
                  schoolTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.type_id && <p className="text-sm text-red-500">{errors.type_id.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="address">Ünvan</Label>
            <Input
              id="address"
              {...register('address')}
              disabled={isReadOnly}
              error={errors.address?.message}
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
          </div>
        </div>
      </Card>
    </form>
  );
};

export default SchoolForm;
