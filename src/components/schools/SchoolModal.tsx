
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createSchool, updateSchool } from "@/services/supabase/schoolService";
import { getRegionsForDropdown } from "@/services/supabase/sector/helperFunctions";

// Define schema for form validation
const schoolSchema = z.object({
  name: z.string().min(3, { message: "Məktəb adı ən azı 3 simvol olmalıdır" }),
  type: z.string({ required_error: "Məktəb növü seçilməlidir" }),
  regionId: z.string({ required_error: "Region seçilməlidir" }),
  sectorId: z.string({ required_error: "Sektor seçilməlidir" }),
  studentCount: z.coerce.number().min(0, { message: "Şagird sayı mənfi ola bilməz" }),
  teacherCount: z.coerce.number().min(0, { message: "Müəllim sayı mənfi ola bilməz" }),
  address: z.string().min(5, { message: "Ünvan ən azı 5 simvol olmalıdır" }),
  contactEmail: z.string().email({ message: "Düzgün email formatı daxil edin" }),
  contactPhone: z.string().min(5, { message: "Telefon nömrəsi ən azı 5 simvol olmalıdır" }),
  status: z.string().default("Aktiv"),
  directorFirstName: z.string().min(2, { message: "Ad ən azı 2 simvol olmalıdır" }),
  directorLastName: z.string().min(2, { message: "Soyad ən azı 2 simvol olmalıdır" }),
  directorEmail: z.string().email({ message: "Düzgün email formatı daxil edin" }),
  directorPhone: z.string().min(5, { message: "Telefon nömrəsi ən azı 5 simvol olmalıdır" }),
});

interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  school?: any; // This would typically have a more specific type
  onSchoolCreated?: () => void;
  onSchoolUpdated?: () => void;
}

export const SchoolModal = ({ 
  isOpen, 
  onClose, 
  mode, 
  school,
  onSchoolCreated,
  onSchoolUpdated 
}: SchoolModalProps) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regions, setRegions] = useState<Array<{id: string, name: string}>>([]);
  const [sectors, setSectors] = useState<Array<{id: string, name: string}>>([]);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof schoolSchema>>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: school?.name || '',
      type: school?.type || '',
      regionId: school?.region_id || '',
      sectorId: school?.sector_id || '',
      studentCount: school?.studentCount || 0,
      teacherCount: school?.teacherCount || 0,
      address: school?.address || '',
      contactEmail: school?.contactEmail || '',
      contactPhone: school?.contactPhone || '',
      status: school?.status || 'Aktiv',
      directorFirstName: '',
      directorLastName: '',
      directorEmail: '',
      directorPhone: '',
    }
  });
  
  // Watch for region changes to load sectors
  const watchedRegionId = form.watch('regionId');
  
  // Load regions when component mounts
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const data = await getRegionsForDropdown();
        setRegions(data);
      } catch (error) {
        console.error('Error loading regions:', error);
        toast({
          title: "Xəta",
          description: "Regionlar yüklənərkən xəta baş verdi",
          variant: "destructive"
        });
      }
    };
    
    loadRegions();
  }, []);
  
  // Load sectors when a region is selected
  useEffect(() => {
    const loadSectors = async () => {
      if (!watchedRegionId) {
        setSectors([]);
        return;
      }
      
      try {
        // This would be replaced with a call to get sectors by region ID
        // For now, using mock data
        const sectorsMock = [
          { id: '1', name: 'Nəsimi rayonu' },
          { id: '2', name: 'Yasamal rayonu' },
          { id: '3', name: 'Sabunçu rayonu' },
          { id: '4', name: 'Mərkəz' },
        ];
        setSectors(sectorsMock);
      } catch (error) {
        console.error('Error loading sectors:', error);
        toast({
          title: "Xəta",
          description: "Sektorlar yüklənərkən xəta baş verdi",
          variant: "destructive"
        });
      }
    };
    
    loadSectors();
  }, [watchedRegionId]);
  
  const onSubmit = async (data: z.infer<typeof schoolSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Combine director names for the API
      const directorName = `${data.directorFirstName} ${data.directorLastName}`;
      
      if (mode === 'create') {
        await createSchool({
          name: data.name,
          type: data.type,
          region_id: data.regionId,
          sector_id: data.sectorId,
          studentCount: data.studentCount,
          teacherCount: data.teacherCount,
          address: data.address,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          status: data.status,
          director: directorName
        });
        
        if (onSchoolCreated) {
          onSchoolCreated();
        }
      } else {
        if (school?.id) {
          await updateSchool(school.id, {
            name: data.name,
            type: data.type,
            region_id: data.regionId,
            sector_id: data.sectorId,
            studentCount: data.studentCount,
            teacherCount: data.teacherCount,
            address: data.address,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone,
            status: data.status,
            director: directorName
          });
          
          if (onSchoolUpdated) {
            onSchoolUpdated();
          }
        }
      }
      
      onClose();
      
    } catch (error) {
      console.error('Error submitting school:', error);
      toast({
        title: "Xəta baş verdi",
        description: "Məktəb məlumatları yadda saxlanılmadı",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Yeni Məktəb Yarat' : 'Məktəb Məlumatlarını Redaktə Et'}
          </DialogTitle>
          <DialogDescription>
            Zəhmət olmasa aşağıdakı formu doldurun. Bütün məcburi xanaları (*) doldurmağınız vacibdir.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="general">Ümumi Məlumatlar</TabsTrigger>
                <TabsTrigger value="director">Direktor Məlumatları</TabsTrigger>
                <TabsTrigger value="admin">Admin Təyini</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Məktəb adı <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Məktəb adını daxil edin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Məktəb növü <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Məktəb növünü seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Orta məktəb">Orta məktəb</SelectItem>
                            <SelectItem value="Tam orta məktəb">Tam orta məktəb</SelectItem>
                            <SelectItem value="İbtidai məktəb">İbtidai məktəb</SelectItem>
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
                    name="regionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Region seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {regions.map(region => (
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
                    name="sectorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sektor <span className="text-red-500">*</span></FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={!watchedRegionId || sectors.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sektor seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sectors.map(sector => (
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="studentCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şagird sayı <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Şagird sayını daxil edin" 
                            {...field}
                            min={0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="teacherCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Müəllim sayı <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Müəllim sayını daxil edin" 
                            {...field}
                            min={0}
                          />
                        </FormControl>
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
                      <FormLabel>Ünvan <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Məktəbin ünvanını daxil edin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Əlaqə e-poçtu <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="E-poçt ünvanını daxil edin" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Əlaqə telefonu <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Telefon nömrəsini daxil edin" {...field} />
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
                      <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              </TabsContent>
              
              <TabsContent value="director" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="directorFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Direktorun adı <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Adı daxil edin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="directorLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Direktorun soyadı <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Soyadı daxil edin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="directorEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-poçt <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="E-poçt ünvanını daxil edin" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="directorPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Telefon nömrəsini daxil edin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-infoline-dark-gray block">
                    Admin seçin
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Mövcud istifadəçini seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">Əliyev Vüqar (vugara@infoline.az)</SelectItem>
                      <SelectItem value="user2">Məmmədov Elnur (elnurm@infoline.az)</SelectItem>
                      <SelectItem value="user3">Hüseynova Aysel (ayselh@infoline.az)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-grow border-t border-infoline-light-gray"></div>
                  <span className="px-4 text-sm text-infoline-dark-gray">və ya</span>
                  <div className="flex-grow border-t border-infoline-light-gray"></div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-infoline-dark-gray">Yeni admin yarat</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-infoline-dark-gray block">
                        Ad
                      </label>
                      <Input placeholder="Adı daxil edin" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-infoline-dark-gray block">
                        Soyad
                      </label>
                      <Input placeholder="Soyadı daxil edin" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-infoline-dark-gray block">
                        E-poçt
                      </label>
                      <Input type="email" placeholder="E-poçt ünvanını daxil edin" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-infoline-dark-gray block">
                        Telefon
                      </label>
                      <Input placeholder="Telefon nömrəsini daxil edin" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Ləğv et
              </Button>
              <Button 
                type="submit" 
                className="bg-infoline-blue hover:bg-infoline-dark-blue"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Gözləyin...' : mode === 'create' ? 'Yarat' : 'Yadda saxla'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
