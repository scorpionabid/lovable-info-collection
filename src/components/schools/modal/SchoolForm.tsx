
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

// Define schema for school form
const schoolFormSchema = z.object({
  name: z.string().min(2, { message: "Məktəb adı ən azı 2 simvol olmalıdır" }),
  code: z.string().optional(),
  address: z.string().optional(),
  director: z.string().optional(),
  email: z.string().email({ message: "Düzgün email daxil edin" }).optional().or(z.literal('')),
  phone: z.string().optional(),
  region_id: z.string().uuid({ message: "Region ID düzgün formatda deyil" }),
  sector_id: z.string().uuid({ message: "Sektor ID düzgün formatda deyil" }),
  type_id: z.string().optional(),
  student_count: z.coerce.number().min(0).optional(),
  teacher_count: z.coerce.number().min(0).optional(),
  status: z.string().optional().default('Aktiv'),
});

type SchoolFormValues = z.infer<typeof schoolFormSchema>;

interface SchoolFormProps {
  mode: 'create' | 'edit';
  school?: any;
  onSuccess: () => void;
}

export const SchoolForm: React.FC<SchoolFormProps> = ({ mode, school, onSuccess }) => {
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);
  const [sectors, setSectors] = useState<{ id: string; name: string }[]>([]);
  const [schoolTypes, setSchoolTypes] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: school?.name || '',
      code: school?.code || '',
      address: school?.address || '',
      director: school?.director || '',
      email: school?.email || '',
      phone: school?.phone || '',
      region_id: school?.region_id || '',
      sector_id: school?.sector_id || '',
      type_id: school?.type_id || '',
      student_count: school?.student_count || 0,
      teacher_count: school?.teacher_count || 0,
      status: school?.status || 'Aktiv',
    },
  });

  // Load regions, sectors, and school types
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch regions
        const { data: regionsData } = await supabase.from('regions').select('id, name').order('name');
        if (regionsData) setRegions(regionsData);

        // Fetch school types
        const { data: typesData } = await supabase.from('school_types').select('id, name').order('name');
        if (typesData) setSchoolTypes(typesData);

        // If editing, set the selected region
        if (school?.region_id) {
          setSelectedRegion(school.region_id);
          
          // Fetch sectors for that region
          const { data: sectorsData } = await supabase
            .from('sectors')
            .select('id, name')
            .eq('region_id', school.region_id)
            .order('name');
          
          if (sectorsData) setSectors(sectorsData);
        }
      } catch (error) {
        console.error('Error loading form data:', error);
        toast.error('Məlumatlar yüklənərkən xəta baş verdi');
      }
    };
    
    loadData();
  }, [school]);

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

  async function onSubmit(values: SchoolFormValues) {
    setIsLoading(true);
    try {
      if (mode === 'create') {
        // Create new school
        const { error } = await supabase.from('schools').insert({
          name: values.name,
          code: values.code || null,
          address: values.address || null,
          director: values.director || null,
          email: values.email || null,
          phone: values.phone || null,
          region_id: values.region_id,
          sector_id: values.sector_id,
          type_id: values.type_id || null,
          student_count: values.student_count || 0,
          teacher_count: values.teacher_count || 0,
          status: values.status || 'Aktiv',
        });

        if (error) throw error;
        toast.success('Məktəb yaradıldı');
      } else {
        // Update existing school
        const { error } = await supabase.from('schools')
          .update({
            name: values.name,
            code: values.code || null,
            address: values.address || null,
            director: values.director || null,
            email: values.email || null,
            phone: values.phone || null,
            region_id: values.region_id,
            sector_id: values.sector_id,
            type_id: values.type_id || null,
            student_count: values.student_count || 0,
            teacher_count: values.teacher_count || 0,
            status: values.status || 'Aktiv',
          })
          .eq('id', school.id);

        if (error) throw error;
        toast.success('Məktəb yeniləndi');
      }
      
      // Call onSuccess to close the modal
      onSuccess();
    } catch (error) {
      console.error('Error submitting school form:', error);
      toast.error('Əməliyyat zamanı xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  }

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    form.setValue('region_id', value);
    form.setValue('sector_id', ''); // Reset sector when region changes
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Məktəb adı *</FormLabel>
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kod</FormLabel>
                <FormControl>
                  <Input placeholder="Məktəb kodu" {...field} />
                </FormControl>
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
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Məktəb növü seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {schoolTypes.map((type) => (
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="region_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region *</FormLabel>
                <Select
                  onValueChange={handleRegionChange}
                  defaultValue={field.value}
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
                <FormLabel>Sektor *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedRegion || sectors.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedRegion ? "Sektor seçin" : "Əvvəlcə region seçin"} />
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
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ünvan</FormLabel>
              <FormControl>
                <Input placeholder="Məktəb ünvanı" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="director"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Direktor</FormLabel>
                <FormControl>
                  <Input placeholder="Direktorun adı" {...field} />
                </FormControl>
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
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Status seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Aktiv">Aktiv</SelectItem>
                    <SelectItem value="Deaktiv">Deaktiv</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contact@example.com" {...field} />
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
                  <Input placeholder="+994XXXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    onChange={e => field.onChange(Number(e.target.value))} 
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
                    onChange={e => field.onChange(Number(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Ləğv et
          </Button>
          <Button type="submit" className="bg-infoline-blue hover:bg-infoline-dark-blue" disabled={isLoading}>
            {isLoading 
              ? 'Gözləyin...' 
              : mode === 'create' ? 'Yarat' : 'Yenilə'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};
