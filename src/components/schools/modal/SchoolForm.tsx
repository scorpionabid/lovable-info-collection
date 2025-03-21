
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { getSchoolTypes } from '@/services/supabase/school/helperFunctions';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Create schema with proper validation
const schoolFormSchema = z.object({
  name: z.string().min(3, { message: 'Məktəb adı ən azı 3 simvol olmalıdır' }),
  region_id: z.string().min(1, { message: 'Region seçilməlidir' }),
  sector_id: z.string().min(1, { message: 'Sektor seçilməlidir' }),
  type_id: z.string().optional(),
  code: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email({ message: 'Düzgün email formatı daxil edin' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  director: z.string().optional(),
  student_count: z.coerce.number().min(0).optional(),
  teacher_count: z.coerce.number().min(0).optional(),
  status: z.string().optional(),
});

type SchoolFormValues = z.infer<typeof schoolFormSchema>;

export interface SchoolFormProps {
  initialData?: any;
  mode: 'create' | 'edit';
  onSuccess: () => void;
  onCancel: () => void;
  regionId?: string;
}

const SchoolForm: React.FC<SchoolFormProps> = ({ 
  initialData, 
  mode, 
  onSuccess, 
  onCancel,
  regionId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);
  const [sectors, setSectors] = useState<{ id: string; name: string }[]>([]);
  const [schoolTypes, setSchoolTypes] = useState<{ id: string; name: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form with default values
  const defaultValues: SchoolFormValues = {
    name: initialData?.name || '',
    region_id: initialData?.region_id || regionId || '',
    sector_id: initialData?.sector_id || '',
    type_id: initialData?.type_id || '',
    code: initialData?.code || '',
    address: initialData?.address || '',
    email: initialData?.email || initialData?.contactEmail || '',
    phone: initialData?.phone || initialData?.contactPhone || '',
    director: initialData?.director || '',
    student_count: initialData?.student_count || initialData?.studentCount || 0,
    teacher_count: initialData?.teacher_count || initialData?.teacherCount || 0,
    status: initialData?.status || 'Aktiv',
  };
  
  const { register, handleSubmit, watch, setValue, formState } = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues
  });
  
  const selectedRegionId = watch('region_id');
  
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
      } catch (error) {
        console.error('Error loading form data:', error);
        toast.error('Məlumatlar yüklənərkən xəta baş verdi');
      }
    };
    
    loadData();
  }, []);

  // When region changes, load sectors for that region
  useEffect(() => {
    const loadSectors = async () => {
      if (!selectedRegionId) {
        setSectors([]);
        return;
      }

      try {
        const { data } = await supabase
          .from('sectors')
          .select('id, name')
          .eq('region_id', selectedRegionId)
          .order('name');
        
        if (data) {
          setSectors(data);
          // If there's only one sector, auto-select it
          if (data.length === 1 && !watch('sector_id')) {
            setValue('sector_id', data[0].id);
          }
        }
      } catch (error) {
        console.error('Error loading sectors:', error);
        toast.error('Sektorlar yüklənərkən xəta baş verdi');
      }
    };

    loadSectors();
  }, [selectedRegionId, setValue, watch]);

  const onSubmit = async (values: SchoolFormValues) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const schoolData = {
        name: values.name,
        sector_id: values.sector_id,
        region_id: values.region_id,
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
      
      if (mode === "edit" && initialData?.id) {
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
      onSuccess();
    } catch (error: any) {
      console.error('Error saving school:', error);
      setErrors({
        submit: error.message || 'Məktəb saxlama zamanı xəta baş verdi'
      });
      toast.error(`Xəta: ${error.message || 'Məktəb saxlama zamanı xəta baş verdi'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {mode === 'create' ? 'Yeni Məktəb Əlavə Et' : 'Məktəb Məlumatlarını Redaktə Et'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Məktəb adı */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Məktəb adı *
            </label>
            <input
              id="name"
              {...register('name')}
              className={`w-full p-2 border rounded-md ${formState.errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formState.errors.name && <p className="text-red-500 text-sm">{formState.errors.name.message}</p>}
          </div>
          
          {/* Məktəb kodu */}
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium">
              Məktəb kodu
            </label>
            <input
              id="code"
              {...register('code')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Region */}
          <div className="space-y-2">
            <label htmlFor="region_id" className="block text-sm font-medium">
              Region *
            </label>
            <select
              id="region_id"
              {...register('region_id')}
              className={`w-full p-2 border rounded-md ${formState.errors.region_id ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Seçin</option>
              {regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
            {formState.errors.region_id && <p className="text-red-500 text-sm">{formState.errors.region_id.message}</p>}
          </div>
          
          {/* Sektor */}
          <div className="space-y-2">
            <label htmlFor="sector_id" className="block text-sm font-medium">
              Sektor *
            </label>
            <select
              id="sector_id"
              {...register('sector_id')}
              className={`w-full p-2 border rounded-md ${formState.errors.sector_id ? 'border-red-500' : 'border-gray-300'}`}
              disabled={!selectedRegionId}
            >
              <option value="">Seçin</option>
              {sectors.map(sector => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
            {formState.errors.sector_id && <p className="text-red-500 text-sm">{formState.errors.sector_id.message}</p>}
          </div>
          
          {/* Məktəb tipi */}
          <div className="space-y-2">
            <label htmlFor="type_id" className="block text-sm font-medium">
              Məktəb tipi
            </label>
            <select
              id="type_id"
              {...register('type_id')}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Seçin</option>
              {schoolTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Ünvan */}
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium">
              Ünvan
            </label>
            <input
              id="address"
              {...register('address')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Direktor */}
          <div className="space-y-2">
            <label htmlFor="director" className="block text-sm font-medium">
              Direktor
            </label>
            <input
              id="director"
              {...register('director')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full p-2 border rounded-md ${formState.errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formState.errors.email && <p className="text-red-500 text-sm">{formState.errors.email.message}</p>}
          </div>
          
          {/* Telefon */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              Telefon
            </label>
            <input
              id="phone"
              {...register('phone')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Şagird sayı */}
          <div className="space-y-2">
            <label htmlFor="student_count" className="block text-sm font-medium">
              Şagird sayı
            </label>
            <input
              id="student_count"
              type="number"
              min="0"
              {...register('student_count')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Müəllim sayı */}
          <div className="space-y-2">
            <label htmlFor="teacher_count" className="block text-sm font-medium">
              Müəllim sayı
            </label>
            <input
              id="teacher_count"
              type="number"
              min="0"
              {...register('teacher_count')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Status */}
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Aktiv">Aktiv</option>
              <option value="Deaktiv">Deaktiv</option>
              <option value="Müvəqqəti bağlı">Müvəqqəti bağlı</option>
            </select>
          </div>
        </div>
        
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {errors.submit}
          </div>
        )}
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Ləğv et
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Yüklənir...' : mode === 'create' ? 'Əlavə et' : 'Yadda saxla'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SchoolForm;
