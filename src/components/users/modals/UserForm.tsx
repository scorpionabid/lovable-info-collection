import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import userService, { User } from '@/services/api/userService';

const userFormSchema = z.object({
  email: z.string().email({ message: 'Düzgün email formatı daxil edin' }),
  password: z.string().min(6, { message: 'Şifrə ən azı 6 simvol olmalıdır' }).optional().or(z.literal('')),
  first_name: z.string().min(2, { message: 'Ad ən azı 2 simvol olmalıdır' }),
  last_name: z.string().min(2, { message: 'Soyad ən azı 2 simvol olmalıdır' }),
  role_id: z.string({ required_error: 'Rol seçilməlidir' }),
  region_id: z.string().optional().or(z.literal('')),
  sector_id: z.string().optional().or(z.literal('')),
  school_id: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  utis_code: z.string().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

export const UserForm = ({ isOpen, onClose, onSuccess, user }: UserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Fetch roles for dropdown
  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => userService.getRoles(),
  });

  // Fetch regions for dropdown
  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: () => userService.getRegions(),
  });

  // Fetch sectors based on selected region
  const { data: sectors = [] } = useQuery({
    queryKey: ['sectors', form.watch('region_id')],
    queryFn: () => userService.getSectors(form.watch('region_id')),
    enabled: !!form.watch('region_id'),
  });

  // Fetch schools based on selected sector
  const { data: schools = [] } = useQuery({
    queryKey: ['schools', form.watch('sector_id')],
    queryFn: () => userService.getSchools(form.watch('sector_id')),
    enabled: !!form.watch('sector_id'),
  });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || '',
      password: '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      role_id: user?.role_id || '',
      region_id: user?.region_id || '',
      sector_id: user?.sector_id || '',
      school_id: user?.school_id || '',
      phone: user?.phone || '',
      utis_code: user?.utis_code || '',
      is_active: user?.is_active ?? true,
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    try {
      if (user) {
        // Update existing user
        await userService.updateUser(user.id, values);
        toast("İstifadəçi məlumatları uğurla yeniləndi");
      } else {
        // Create new user
        await userService.createUser(values);
        toast("İstifadəçi uğurla yaradıldı");
      }
      onSuccess();
    } catch (error) {
      toast("Xəta baş verdi", {
        description: error instanceof Error ? error.message : 'Bilinməyən xəta'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle role change to reset dependent fields
  const handleRoleChange = (roleId: string) => {
    form.setValue('role_id', roleId);
    
    // Reset dependent fields based on role
    const role = roles.find(r => r.id === roleId);
    if (role) {
      if (role.name === 'super-admin') {
        form.setValue('region_id', '');
        form.setValue('sector_id', '');
        form.setValue('school_id', '');
      } else if (role.name === 'region-admin') {
        form.setValue('sector_id', '');
        form.setValue('school_id', '');
      } else if (role.name === 'sector-admin') {
        form.setValue('school_id', '');
      }
    }
  };

  // Handle region change to reset dependent fields
  const handleRegionChange = (regionId: string) => {
    form.setValue('region_id', regionId);
    form.setValue('sector_id', '');
    form.setValue('school_id', '');
  };

  // Handle sector change to reset dependent fields
  const handleSectorChange = (sectorId: string) => {
    form.setValue('sector_id', sectorId);
    form.setValue('school_id', '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>{user ? 'İstifadəçini Redaktə Et' : 'Yeni İstifadəçi Əlavə Et'}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profil məlumatları</TabsTrigger>
            <TabsTrigger value="role">Rol və təşkilat</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="profile">
                <div className="space-y-4 py-2">
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{user ? 'Yeni şifrə (dəyişdirmək istəyirsinizsə)' : 'Şifrə'}</FormLabel>
                        <FormControl>
                          <Input placeholder="Şifrə" type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          {user ? 'Boş buraxsanız, şifrə dəyişdirilməyəcək' : 'Ən azı 6 simvol'}
                        </FormDescription>
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
                          <Input placeholder="Telefon" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="utis_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UTİS kodu</FormLabel>
                        <FormControl>
                          <Input placeholder="UTİS kodu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Aktiv</FormLabel>
                          <FormDescription>
                            İstifadəçi hesabı aktiv olsun?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="role">
                <div className="space-y-4 py-2">
                  <FormField
                    control={form.control}
                    name="role_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <Select
                          onValueChange={handleRoleChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Rol seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
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
                    name="region_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region</FormLabel>
                        <Select
                          onValueChange={handleRegionChange}
                          defaultValue={field.value}
                          value={field.value}
                          disabled={form.watch('role_id') === 'super-admin'}
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
                        <FormLabel>Sektor</FormLabel>
                        <Select
                          onValueChange={handleSectorChange}
                          defaultValue={field.value}
                          value={field.value}
                          disabled={!form.watch('region_id') || ['super-admin', 'region-admin'].includes(form.watch('role_id'))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sektor seçin" />
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

                  <FormField
                    control={form.control}
                    name="school_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Məktəb</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          disabled={!form.watch('sector_id') || ['super-admin', 'region-admin', 'sector-admin'].includes(form.watch('role_id'))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Məktəb seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {schools.map((school) => (
                              <SelectItem key={school.id} value={school.id}>
                                {school.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" type="button" onClick={onClose}>Ləğv et</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Gözləyin...' : user ? 'Yenilə' : 'Əlavə et'}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
