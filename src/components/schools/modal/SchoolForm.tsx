
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schoolSchema, SchoolFormValues } from './types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { School } from '@/lib/supabase/types/school';
import { Textarea } from '@/components/ui/textarea';
import { SelectRegion } from '../selects/SelectRegion';
import { SelectSector } from '../selects/SelectSector';
import { SelectSchoolType } from '../selects/SelectSchoolType';

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
      code: initialData?.code || '',
      regionId: initialData?.region_id || regionId || '',
      sectorId: initialData?.sector_id || '',
      type: initialData?.type_id || '',
      address: initialData?.address || '',
      studentCount: initialData?.student_count || 0,
      teacherCount: initialData?.teacher_count || 0,
      contactEmail: initialData?.email || '',
      contactPhone: initialData?.phone || '',
      status: initialData?.status || 'Aktiv',
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

        {/* School code field */}
        <div className="space-y-2">
          <label htmlFor="code" className="block text-sm font-medium">
            Məktəb kodu *
          </label>
          <Input
            id="code"
            disabled={disabled}
            {...register('code')}
            className={errors.code ? 'border-red-500' : ''}
          />
          {errors.code && (
            <p className="text-xs text-red-500">{errors.code.message}</p>
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
