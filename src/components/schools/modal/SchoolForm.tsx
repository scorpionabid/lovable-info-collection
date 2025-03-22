
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { School } from '@/lib/supabase/types/school';
import { Textarea } from '@/components/ui/textarea';
import SelectRegion from '../selects/SelectRegion';
import SelectSector from '../selects/SelectSector';
import SelectSchoolType from '../selects/SelectSchoolType';

// Zod schema for form validation
const schoolSchema = z.object({
  name: z.string().min(3, { message: "Məktəb adı ən azı 3 simvol olmalıdır" }),
  status: z.string().optional(),
  type: z.string().optional(),
  address: z.string().optional(),
  regionId: z.string().optional(),
  sectorId: z.string().min(1, { message: "Sektor seçilməlidir" }),
  studentCount: z.coerce.number().optional(),
  teacherCount: z.coerce.number().optional(),
  contactEmail: z.string().email({ message: "Düzgün email formatı daxil edin" }).optional().or(z.literal('')),
  contactPhone: z.string().optional(),
});

type SchoolFormValues = z.infer<typeof schoolSchema>;

interface SchoolFormProps {
  initialData?: School;
  regionId?: string;
  onSubmit: (data: SchoolFormValues) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const SchoolForm: React.FC<SchoolFormProps> = ({
  initialData,
  regionId,
  onSubmit,
  isLoading,
  disabled = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: initialData?.name || '',
      status: initialData?.status || 'Aktiv',
      type: initialData?.type_id || '',
      address: initialData?.address || '',
      regionId: initialData?.region_id || regionId || '',
      sectorId: initialData?.sector_id || '',
      studentCount: initialData?.student_count || 0,
      teacherCount: initialData?.teacher_count || 0,
      contactEmail: initialData?.email || '',
      contactPhone: initialData?.phone || '',
    },
  });

  const watchedRegionId = watch('regionId');

  const handleFormSubmit = (data: SchoolFormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* School name field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Məktəb adı *
          </label>
          <Input
            id="name"
            disabled={disabled}
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Region select */}
        <div className="space-y-2">
          <label htmlFor="regionId" className="block text-sm font-medium">
            Region *
          </label>
          <SelectRegion
            control={control}
            name="regionId"
            error={errors.regionId?.message}
            disabled={disabled || !!regionId}
          />
        </div>

        {/* Sector select */}
        <div className="space-y-2">
          <label htmlFor="sectorId" className="block text-sm font-medium">
            Sektor *
          </label>
          <SelectSector
            control={control}
            name="sectorId"
            regionId={watchedRegionId}
            error={errors.sectorId?.message}
            disabled={disabled || !watchedRegionId}
          />
        </div>

        {/* School type select */}
        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium">
            Məktəb tipi *
          </label>
          <SelectSchoolType
            control={control}
            name="type"
            error={errors.type?.message}
            disabled={disabled}
          />
        </div>

        {/* Address field */}
        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium">
            Ünvan
          </label>
          <Input
            id="address"
            disabled={disabled}
            {...register('address')}
            className={errors.address ? 'border-red-500' : ''}
          />
          {errors.address && (
            <p className="text-xs text-red-500">{errors.address.message}</p>
          )}
        </div>

        {/* Additional fields can be added here */}
      </div>

      {/* Submit button */}
      {!disabled && (
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Yüklənir...' : initialData ? 'Yenilə' : 'Yarat'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default SchoolForm;
