
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

import { School } from '@/supabase/types';
import { useRegions } from '@/components/schools/hooks/useRegions';
import { useSectors } from '@/components/schools/hooks/useSectors';

// Schema for form validation
const schoolSchema = z.object({
  name: z.string().min(2, { message: 'Məktəb adı ən az 2 simvol olmalıdır' }),
  code: z.string().optional(),
  address: z.string().min(5, { message: 'Ünvan ən az 5 simvol olmalıdır' }),
  region_id: z.string().uuid({ message: 'Region seçilməlidir' }),
  sector_id: z.string().uuid({ message: 'Sektor seçilməlidir' }),
  type_id: z.string().optional(),
  director: z.string().optional(),
  email: z.string().email({ message: 'Düzgün email formatı daxil edin' }).optional(),
  phone: z.string().optional(),
  student_count: z.coerce.number().optional(),
  teacher_count: z.coerce.number().optional(),
  status: z.string().optional(),
});

type SchoolFormValues = z.infer<typeof schoolSchema>;

interface SchoolFormProps {
  initialData?: Partial<School>;
  onSubmit: (data: SchoolFormValues) => void;
  onCancel: () => void;
}

export const SchoolForm: React.FC<SchoolFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [activeTab, setActiveTab] = useState('general');
  const { regions, isLoading: regionsLoading } = useRegions();
  const [selectedRegion, setSelectedRegion] = useState(initialData?.region_id || '');
  const { sectors, isLoading: sectorsLoading } = useSectors();
  
  // Filter sectors based on selected region
  const filteredSectors = sectors.filter(sector => 
    !selectedRegion || sector.region_id === selectedRegion
  );

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      address: initialData?.address || '',
      region_id: initialData?.region_id || '',
      sector_id: initialData?.sector_id || '',
      type_id: initialData?.type_id || '',
      director: initialData?.director || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      student_count: initialData?.student_count || 0,
      teacher_count: initialData?.teacher_count || 0,
      status: initialData?.status || 'Aktiv',
    }
  });

  // Update sector options when region changes
  useEffect(() => {
    const regionId = form.getValues('region_id');
    if (regionId !== selectedRegion) {
      setSelectedRegion(regionId);
      // Reset sector selection if region changes
      if (selectedRegion) {
        form.setValue('sector_id', '');
      }
    }
  }, [form.watch('region_id')]);

  const handleSubmit = (data: SchoolFormValues) => {
    try {
      onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Məlumatlar yadda saxlanarkən xəta baş verdi');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Əsas məlumatlar</TabsTrigger>
            <TabsTrigger value="additional">Əlavə məlumatlar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 mt-4">
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
            
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Məktəb kodu</FormLabel>
                  <FormControl>
                    <Input placeholder="Məktəb kodunu daxil edin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ünvan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Məktəbin ünvanını daxil edin" {...field} />
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
                    <FormControl>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        disabled={regionsLoading}
                        {...field}
                      >
                        <option value="">Seçin</option>
                        {regions.map(region => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
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
                    <FormControl>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        disabled={sectorsLoading || !selectedRegion}
                        {...field}
                      >
                        <option value="">Seçin</option>
                        {filteredSectors.map(sector => (
                          <option key={sector.id} value={sector.id}>
                            {sector.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="additional" className="space-y-4 mt-4">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
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
                      <Input placeholder="Telefon nömrəsi" {...field} />
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
                      <Input type="number" placeholder="Şagird sayı" {...field} />
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
                      <Input type="number" placeholder="Müəllim sayı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      {...field}
                    >
                      <option value="Aktiv">Aktiv</option>
                      <option value="Qeyri-aktiv">Qeyri-aktiv</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Ləğv et
          </Button>
          <Button type="submit">
            {initialData ? 'Yenilə' : 'Əlavə et'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
