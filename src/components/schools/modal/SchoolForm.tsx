
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

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
  type_id: z.string().uuid({ message: "Tip ID düzgün formatda deyil" }).optional(),
  student_count: z.number().min(0).optional(),
  teacher_count: z.number().min(0).optional(),
});

type SchoolFormValues = z.infer<typeof schoolFormSchema>;

interface SchoolFormProps {
  mode: 'create' | 'edit';
  school?: any;
  onSuccess: () => void;
}

export const SchoolForm: React.FC<SchoolFormProps> = ({ mode, school, onSuccess }) => {
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
    },
  });

  async function onSubmit(values: SchoolFormValues) {
    try {
      // In a real implementation, this would call a service to create/update the school
      console.log('School form submitted:', values);
      
      // Show success message
      toast(mode === 'create' ? 'Məktəb yaradıldı' : 'Məktəb yeniləndi');
      
      // Call onSuccess to close the modal
      onSuccess();
    } catch (error) {
      console.error('Error submitting school form:', error);
      toast('Əməliyyat zamanı xəta baş verdi');
    }
  }

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
        </div>
        
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Button type="submit" className="bg-infoline-blue">
            {mode === 'create' ? 'Yaradın' : 'Yeniləyin'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
