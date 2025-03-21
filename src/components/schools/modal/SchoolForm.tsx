
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSchoolTypes } from '../hooks/useSchoolTypes';
import { useRegions } from '../hooks/useRegions';
import { useSectors } from '../hooks/useSectors';
import { createSchool, updateSchool } from '@/services/supabase/school/crudOperations';
import { toast } from '@/hooks/use-toast';
import { School } from '@/services/supabase/school/types';

// Define the form schema with Zod
const schoolFormSchema = z.object({
  name: z.string().min(2, { message: 'Məktəbin adı ən azı 2 simvol olmalıdır' }),
  region_id: z.string().optional(),
  sector_id: z.string(),
  code: z.string().optional(),
  address: z.string().optional(),
  type_id: z.string().optional(),
  email: z.string().email({ message: 'Düzgün e-mail ünvanı daxil edin' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  director: z.string().optional(),
  student_count: z.coerce.number().int().nonnegative().optional(),
  teacher_count: z.coerce.number().int().nonnegative().optional(),
});

// Define the props for the SchoolForm component
interface SchoolFormProps {
  initialData?: School | null;
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
  onCancel?: () => void;
  regionId?: string;
  sectorId?: string;
}

export default function SchoolForm({
  initialData,
  mode = 'create',
  onSuccess,
  onCancel,
  regionId,
  sectorId,
}: SchoolFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { schoolTypes, isLoading: isLoadingSchoolTypes } = useSchoolTypes();
  const { regions, isLoading: isLoadingRegions } = useRegions();
  
  // Get sectors, pre-filtered by region if provided
  const { sectors, isLoading: isLoadingSectors } = useSectors(
    mode === 'create' ? regionId : initialData?.region_id
  );

  // Initialize form with default values or existing data
  const form = useForm<z.infer<typeof schoolFormSchema>>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      region_id: initialData?.region_id || regionId || '',
      sector_id: initialData?.sector_id || sectorId || '',
      code: initialData?.code || '',
      address: initialData?.address || '',
      type_id: initialData?.type_id || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      director: initialData?.director || '',
      student_count: initialData?.student_count || 0,
      teacher_count: initialData?.teacher_count || 0,
    },
  });

  // Function to handle form submission
  const onSubmit = async (values: z.infer<typeof schoolFormSchema>) => {
    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        // Ensure required fields are present
        if (!values.name || !values.sector_id) {
          setIsSubmitting(false);
          return toast({
            title: "Xəta",
            description: "Məcburi xanaları doldurun",
            variant: "destructive",
          });
        }
        
        await createSchool({
          name: values.name,
          region_id: values.region_id,
          sector_id: values.sector_id,
          code: values.code,
          address: values.address,
          type_id: values.type_id,
          email: values.email || undefined,
          phone: values.phone || undefined,
          director: values.director || undefined,
          student_count: values.student_count || 0,
          teacher_count: values.teacher_count || 0,
        });
        
        toast({
          title: "Uğurlu əməliyyat",
          description: "Məktəb uğurla yaradıldı",
        });
      } else if (initialData) {
        await updateSchool(initialData.id, {
          name: values.name,
          region_id: values.region_id,
          sector_id: values.sector_id,
          code: values.code,
          address: values.address,
          type_id: values.type_id,
          email: values.email || undefined,
          phone: values.phone || undefined,
          director: values.director || undefined,
          student_count: values.student_count || 0,
          teacher_count: values.teacher_count || 0,
        });
        
        toast({
          title: "Uğurlu əməliyyat",
          description: "Məktəb məlumatları yeniləndi",
        });
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Məktəb əməliyyatı xətası:', error);
      toast({
        title: "Xəta",
        description: `Məktəb ${mode === 'create' ? 'yaradılarkən' : 'yenilənərkən'} xəta baş verdi`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch region_id to reset sector_id when region changes
  const watchedRegionId = form.watch('region_id');
  const handleRegionChange = (value: string) => {
    form.setValue('region_id', value);
    form.setValue('sector_id', ''); // Reset sector when region changes
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* School Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Məktəbin adı *</FormLabel>
                    <FormControl>
                      <Input placeholder="Məktəbin adını daxil edin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* School Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Məktəb kodu</FormLabel>
                    <FormControl>
                      <Input placeholder="Məktəb kodu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Region Selection */}
              <FormField
                control={form.control}
                name="region_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <Select
                      disabled={isLoadingRegions}
                      value={field.value}
                      onValueChange={handleRegionChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Region seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regions?.map((region) => (
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

              {/* Sector Selection */}
              <FormField
                control={form.control}
                name="sector_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sektor *</FormLabel>
                    <Select
                      disabled={isLoadingSectors || !watchedRegionId}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sektor seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sectors?.map((sector) => (
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

              {/* School Type */}
              <FormField
                control={form.control}
                name="type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Məktəb növü</FormLabel>
                    <Select
                      disabled={isLoadingSchoolTypes}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Məktəb növü seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schoolTypes?.map((type) => (
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

              {/* Director */}
              <FormField
                control={form.control}
                name="director"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Direktor</FormLabel>
                    <FormControl>
                      <Input placeholder="Direktor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="E-mail" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Student Count */}
              <FormField
                control={form.control}
                name="student_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şagird sayı</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Şagird sayı"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Teacher Count */}
              <FormField
                control={form.control}
                name="teacher_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Müəllim sayı</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Müəllim sayı"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ünvan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Məktəbin ünvanı"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Buttons */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Ləğv et
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Gözləyin...' : mode === 'create' ? 'Yarat' : 'Yenilə'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
