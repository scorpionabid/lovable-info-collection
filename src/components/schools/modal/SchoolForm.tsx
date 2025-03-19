
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { School, CreateSchoolDto, UpdateSchoolDto } from '@/services/supabase/school/types';
import * as schoolService from '@/services/supabase/school';
import { supabase } from '@/services/supabase/client';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Define the schema for school form validation
const schoolSchema = z.object({
  name: z.string().min(2, "Ad minimum 2 simvol olmalıdır"),
  code: z.string().optional(),
  region_id: z.string().optional(),
  sector_id: z.string().min(1, "Sektor seçilməlidir"),
  type_id: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  student_count: z.coerce.number().int().optional(),
  teacher_count: z.coerce.number().int().optional(),
  director: z.string().optional(),
  email: z.string().email("Düzgün email daxil edin").optional().or(z.literal("")),
  phone: z.string().optional(),
  archived: z.boolean().default(false)
});

type SchoolFormValues = z.infer<typeof schoolSchema>;

export interface SchoolFormProps {
  mode: 'create' | 'edit';
  initialData?: School;
  onSuccess: () => void;
}

export const SchoolForm = ({ mode, initialData, onSuccess }: SchoolFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [schoolTypes, setSchoolTypes] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState(initialData?.region_id || '');

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      region_id: initialData?.region_id || '',
      sector_id: initialData?.sector_id || '',
      type_id: initialData?.type_id || '',
      address: initialData?.address || '',
      status: (initialData?.status as "active" | "inactive") || 'active',
      student_count: initialData?.student_count || 0,
      teacher_count: initialData?.teacher_count || 0,
      director: initialData?.director || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      archived: initialData?.archived || false
    }
  });

  // Fetch regions, sectors, and school types on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch regions
        const { data: regionsData, error: regionsError } = await supabase
          .from('regions')
          .select('id, name')
          .order('name');
        
        if (regionsError) throw regionsError;
        setRegions(regionsData || []);

        // Fetch sectors
        await fetchSectors(initialData?.region_id);

        // Fetch school types using the helper function
        const schoolTypesData = await schoolService.getSchoolTypes();
        setSchoolTypes(schoolTypesData || []);
      } catch (error) {
        console.error('Error fetching form data:', error);
        toast({
          title: "Məlumat yüklənmə xətası",
          description: "Məlumatları yükləyərkən xəta baş verdi",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, [initialData]);

  // Fetch sectors when region selection changes
  const fetchSectors = async (regionId?: string) => {
    try {
      let query = supabase.from('sectors').select('id, name');
      
      if (regionId) {
        query = query.eq('region_id', regionId);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      setSectors(data || []);
    } catch (error) {
      console.error('Error fetching sectors:', error);
    }
  };

  // Handle region change
  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    form.setValue('region_id', regionId);
    form.setValue('sector_id', ''); // Reset sector when region changes
    fetchSectors(regionId);
  };

  // Handle form submission
  const onSubmit = async (values: SchoolFormValues) => {
    setIsLoading(true);
    try {
      if (mode === 'create') {
        // Create new school
        const schoolData: CreateSchoolDto = {
          name: values.name,
          code: values.code,
          region_id: values.region_id,
          sector_id: values.sector_id,
          type_id: values.type_id,
          address: values.address,
          status: values.status,
          student_count: values.student_count,
          teacher_count: values.teacher_count,
          director: values.director,
          email: values.email,
          phone: values.phone,
          archived: values.archived
        };
        
        await schoolService.createSchool(schoolData);
        toast({
          title: "Məktəb yaradıldı",
          description: "Məktəb uğurla əlavə edildi",
        });
      } else if (initialData?.id) {
        // Update existing school
        const schoolData: UpdateSchoolDto = {
          name: values.name,
          code: values.code,
          region_id: values.region_id,
          sector_id: values.sector_id,
          type_id: values.type_id,
          address: values.address,
          status: values.status,
          student_count: values.student_count,
          teacher_count: values.teacher_count,
          director: values.director,
          email: values.email,
          phone: values.phone,
          archived: values.archived
        };
        
        await schoolService.updateSchool(initialData.id, schoolData);
        toast({
          title: "Məktəb yeniləndi",
          description: "Məktəb məlumatları uğurla yeniləndi",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving school:', error);
      toast({
        title: "Xəta baş verdi",
        description: "Məktəb məlumatları saxlanarkən xəta baş verdi",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Məktəb adı</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Məktəb adını daxil edin"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Kod</Label>
          <Input
            id="code"
            {...form.register('code')}
            placeholder="Məktəb kodu"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select
            value={selectedRegion}
            onValueChange={handleRegionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Region seçin" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sector">Sektor</Label>
          <Select
            value={form.watch('sector_id')}
            onValueChange={(value) => form.setValue('sector_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sektor seçin" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map(sector => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.sector_id && (
            <p className="text-sm text-red-500">{form.formState.errors.sector_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Məktəb növü</Label>
          <Select
            value={form.watch('type_id')}
            onValueChange={(value) => form.setValue('type_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Məktəb növü seçin" />
            </SelectTrigger>
            <SelectContent>
              {schoolTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Ünvan</Label>
          <Input
            id="address"
            {...form.register('address')}
            placeholder="Məktəb ünvanı"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentCount">Şagird sayı</Label>
          <Input
            id="studentCount"
            type="number"
            {...form.register('student_count')}
            placeholder="Şagird sayı"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="teacherCount">Müəllim sayı</Label>
          <Input
            id="teacherCount"
            type="number"
            {...form.register('teacher_count')}
            placeholder="Müəllim sayı"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="director">Direktor</Label>
          <Input
            id="director"
            {...form.register('director')}
            placeholder="Direktor adı"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-poçt</Label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            placeholder="E-poçt ünvanı"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            {...form.register('phone')}
            placeholder="Telefon nömrəsi"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={form.watch('status')}
            onValueChange={(value: 'active' | 'inactive') => form.setValue('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="inactive">Deaktiv</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="archived"
            checked={form.watch('archived')}
            onCheckedChange={(value) => form.setValue('archived', value)}
          />
          <Label htmlFor="archived">Arxivləşdirilib</Label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Yarat' : 'Yadda saxla'}
        </Button>
      </div>
    </form>
  );
};
