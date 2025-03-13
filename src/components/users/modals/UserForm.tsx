
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import userService, { User } from '@/services/api/userService';

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Düzgün e-poçt ünvanı daxil edin" }),
  first_name: z.string().min(2, { message: "Ən az 2 simvol olmalıdır" }),
  last_name: z.string().min(2, { message: "Ən az 2 simvol olmalıdır" }),
  role_id: z.string().min(1, { message: "Rol seçilməlidir" }),
  region_id: z.string().optional(),
  sector_id: z.string().optional(),
  school_id: z.string().optional(),
  phone: z.string().optional(),
  utis_code: z.string().optional(),
  is_active: z.boolean().default(true),
  password: z.string().min(6, { message: "Şifrə ən az 6 simvol olmalıdır" }).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

export const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user
}) => {
  const isEditMode = !!user;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      role_id: user?.role_id || '',
      region_id: user?.region_id || '',
      sector_id: user?.sector_id || '',
      school_id: user?.school_id || '',
      phone: user?.phone || '',
      utis_code: user?.utis_code || '',
      is_active: user?.is_active ?? true,
      password: '',
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      if (isEditMode && user) {
        // If password is empty, remove it from the payload in edit mode
        if (!values.password) {
          const { password, ...dataWithoutPassword } = values;
          await userService.updateUser(user.id, dataWithoutPassword);
        } else {
          await userService.updateUser(user.id, values);
        }
        toast("İstifadəçi uğurla yeniləndi");
      } else {
        // New user requires password
        if (!values.password) {
          form.setError('password', { message: 'Şifrə tələb olunur' });
          return;
        }
        
        // Since the createUser expects a User type but we don't have an ID yet,
        // we cast it as any for this specific case
        await userService.createUser(values as any);
        toast("İstifadəçi uğurla yaradıldı");
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving user:', error);
      toast("İstifadəçi yaddaşda saxlanılarkən xəta baş verdi", {
        variant: "destructive"
      });
    }
  }

  // Reset form when modal closes or user changes
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        email: user?.email || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        role_id: user?.role_id || '',
        region_id: user?.region_id || '',
        sector_id: user?.sector_id || '',
        school_id: user?.school_id || '',
        phone: user?.phone || '',
        utis_code: user?.utis_code || '',
        is_active: user?.is_active ?? true,
        password: '',
      });
    }
  }, [isOpen, user, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'İstifadəçi məlumatlarını düzəlt' : 'Yeni istifadəçi əlavə et'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="istifadeci@domain.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad</FormLabel>
                    <FormControl>
                      <Input placeholder="Ad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soyad</FormLabel>
                    <FormControl>
                      <Input placeholder="Soyad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Rol seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="user">İstifadəçi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEditMode ? 'Şifrə (dəyişdirmək istəmirsinizsə boş buraxın)' : 'Şifrə'}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Şifrə" {...field} />
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
            
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Aktiv</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Ləğv et
              </Button>
              <Button type="submit">
                {isEditMode ? 'Yenilə' : 'Əlavə et'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
