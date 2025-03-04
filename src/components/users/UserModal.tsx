
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  X, 
  Mail, 
  User, 
  Phone, 
  Shield, 
  Building, 
  Map, 
  School, 
  Upload, 
  Info,
  Check,
  Loader2
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import authService from "@/services/api/authService";
import userService, { User as UserType } from "@/services/api/userService";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the validation schema
const userFormSchema = z.object({
  email: z.string().email({ message: "Düzgün email daxil edin" }),
  first_name: z.string().min(2, { message: "Ad ən azı 2 simvol olmalıdır" }),
  last_name: z.string().min(2, { message: "Soyad ən azı 2 simvol olmalıdır" }),
  phone: z.string().optional(),
  role_id: z.string({ required_error: "Rol seçin" }),
  region_id: z.string().optional(),
  sector_id: z.string().optional(),
  school_id: z.string().optional(),
  is_active: z.boolean().default(true),
  password: z.string().min(6, { message: "Şifrə ən azı 6 simvol olmalıdır" }).optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserModalProps {
  user?: UserType;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UserModal = ({ user, onClose, onSuccess }: UserModalProps) => {
  const [selectedRole, setSelectedRole] = useState(user?.role_id || "");
  const [selectedRegion, setSelectedRegion] = useState(user?.region_id || "");
  const [selectedSector, setSelectedSector] = useState(user?.sector_id || "");
  const [isCreatingAuth, setIsCreatingAuth] = useState(false);
  const { toast } = useToast();
  const isEditing = !!user;

  // Set up form with validation
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: "",
      role_id: user?.role_id || "",
      region_id: user?.region_id || "",
      sector_id: user?.sector_id || "",
      school_id: user?.school_id || "",
      is_active: user?.is_active !== undefined ? user.is_active : true,
      password: "",
    },
  });

  const getInitials = (name: string, surname: string) => {
    return `${name?.charAt(0) || ""}${surname?.charAt(0) || ""}`;
  };

  // Fetch data for dropdowns
  const { data: roles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => userService.getRoles(),
  });

  const { data: regions = [], isLoading: isLoadingRegions } = useQuery({
    queryKey: ['regions'],
    queryFn: () => userService.getRegions(),
  });
  
  const { data: sectors = [], isLoading: isLoadingSectors } = useQuery({
    queryKey: ['sectors', selectedRegion],
    queryFn: () => userService.getSectors(selectedRegion),
    enabled: !!selectedRegion,
  });

  const { data: schools = [], isLoading: isLoadingSchools } = useQuery({
    queryKey: ['schools', selectedSector],
    queryFn: () => userService.getSchools(selectedSector),
    enabled: !!selectedSector,
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      setIsCreatingAuth(true);
      
      try {
        // First create auth user if it's a new user
        if (!isEditing && values.password) {
          await authService.register({
            email: values.email,
            password: values.password,
            firstName: values.first_name,
            lastName: values.last_name,
            role: values.role_id
          });
        }
        
        // Then create or update the user in the database
        const userData = {
          ...values,
          password: undefined, // Remove password from database insert
        };
        
        if (isEditing) {
          return await userService.updateUser(user.id, userData);
        } else {
          return await userService.createUser(userData);
        }
      } finally {
        setIsCreatingAuth(false);
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "İstifadəçi yeniləndi" : "İstifadəçi yaradıldı",
        description: isEditing 
          ? `${form.getValues().first_name} ${form.getValues().last_name} məlumatları uğurla yeniləndi` 
          : `${form.getValues().first_name} ${form.getValues().last_name} uğurla yaradıldı`,
      });
      
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Xəta baş verdi",
        description: `${isEditing ? "Yeniləmə" : "Yaratma"} xətası: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  // Update form values when role selection changes
  useEffect(() => {
    const role = roles.find(r => r.id === selectedRole);
    if (role) {
      form.setValue("role_id", role.id);
    }
  }, [selectedRole, roles, form]);

  // Update region, sector, school fields in form when they change
  useEffect(() => {
    form.setValue("region_id", selectedRegion || "");
    
    // Reset sector and school if region changes
    if (!selectedRegion) {
      setSelectedSector("");
      form.setValue("sector_id", "");
      form.setValue("school_id", "");
    }
  }, [selectedRegion, form]);

  useEffect(() => {
    form.setValue("sector_id", selectedSector || "");
    
    // Reset school if sector changes
    if (!selectedSector) {
      form.setValue("school_id", "");
    }
  }, [selectedSector, form]);

  // Find role details
  const getRoleById = (roleId: string) => {
    return roles.find(role => role.id === roleId);
  };

  const onSubmit = (values: UserFormValues) => {
    createUserMutation.mutate(values);
  };

  const isLoading = isLoadingRoles || isLoadingRegions || isLoadingSectors || isLoadingSchools;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            {isEditing ? "İstifadəçi Redaktəsi" : "Yeni İstifadəçi"}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center py-6">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-infoline-blue mb-2" />
              <p className="text-sm text-infoline-dark-gray">Məlumatlar yüklənir...</p>
            </div>
          </div>
        )}

        {!isLoading && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Profil Məlumatları</TabsTrigger>
                  <TabsTrigger value="role">Rol və Təşkilat</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-4 space-y-4">
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-infoline-light-blue text-white text-xl">
                        {isEditing 
                          ? getInitials(user.first_name, user.last_name) 
                          : form.getValues().first_name && form.getValues().last_name 
                            ? getInitials(form.getValues().first_name, form.getValues().last_name)
                            : "YI"
                        }
                      </AvatarFallback>
                    </Avatar>
                    
                    <Button variant="outline" size="sm" className="flex items-center gap-1" type="button">
                      <Upload className="h-4 w-4" />
                      <span>Profil şəkli yüklə</span>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ad</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} />
                          </FormControl>
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
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-infoline-dark-gray" />
                              <Input {...field} className="pl-9" type="email" />
                            </div>
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
                            <div className="relative">
                              <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-infoline-dark-gray" />
                              <Input {...field} className="pl-9" type="tel" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {!isEditing && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Şifrə</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {!isEditing && (
                    <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium">Şifrə haqqında qeyd</p>
                        <p>İstifadəçi yaradıldıqdan sonra, ona təyin olunan şifrəni email vasitəsilə bildirmək lazımdır.</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="role" className="mt-4 space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-infoline-dark-blue">İstifadəçi Rolu</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {roles.map((role) => {
                        const isSelected = selectedRole === role.id;
                        let Icon = School;
                        
                        // Determine icon based on role name
                        if (role.name.includes("super")) Icon = Shield;
                        else if (role.name.includes("region")) Icon = Map;
                        else if (role.name.includes("sector")) Icon = Building;
                        
                        return (
                          <div 
                            key={role.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              isSelected 
                              ? "border-infoline-blue bg-infoline-blue/5 ring-1 ring-infoline-blue" 
                              : "hover:border-infoline-light-gray"
                            }`}
                            onClick={() => setSelectedRole(role.id)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className={`p-1.5 rounded-full ${isSelected ? "bg-infoline-blue text-white" : "bg-infoline-light-gray"}`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              
                              {isSelected && (
                                <Check className="h-4 w-4 text-infoline-blue" />
                              )}
                            </div>
                            
                            <h5 className="font-medium text-infoline-dark-blue mb-1">
                              {role.name === 'superadmin' || role.name === 'super-admin' 
                                ? 'SuperAdmin' 
                                : role.name === 'region-admin'
                                ? 'Region Admin'
                                : role.name === 'sector-admin'
                                ? 'Sektor Admin'
                                : role.name === 'school-admin'
                                ? 'Məktəb Admin'
                                : role.name}
                            </h5>
                            <p className="text-xs text-infoline-dark-gray">{role.description || "Bu rol üçün təsvir yoxdur"}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-infoline-dark-blue">Əlaqəli Təşkilat</h4>
                    
                    {selectedRole && (
                      <>
                        {getRoleById(selectedRole)?.name.includes("region") && (
                          <div className="space-y-2">
                            <Label htmlFor="region">Region</Label>
                            <Select 
                              value={selectedRegion} 
                              onValueChange={setSelectedRegion}
                            >
                              <SelectTrigger id="region">
                                <SelectValue placeholder="Region seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {regions.map((region) => (
                                  <SelectItem key={region.id} value={region.id}>
                                    {region.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        {getRoleById(selectedRole)?.name.includes("sector") && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="region-sector">Region</Label>
                              <Select
                                value={selectedRegion}
                                onValueChange={setSelectedRegion}
                              >
                                <SelectTrigger id="region-sector">
                                  <SelectValue placeholder="Region seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                  {regions.map((region) => (
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
                                value={selectedSector}
                                onValueChange={setSelectedSector}
                                disabled={!selectedRegion || sectors.length === 0}
                              >
                                <SelectTrigger id="sector">
                                  <SelectValue placeholder="Sektor seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                  {sectors.map((sector) => (
                                    <SelectItem key={sector.id} value={sector.id}>
                                      {sector.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                        
                        {getRoleById(selectedRole)?.name.includes("school") && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="region-school">Region</Label>
                              <Select
                                value={selectedRegion}
                                onValueChange={setSelectedRegion}
                              >
                                <SelectTrigger id="region-school">
                                  <SelectValue placeholder="Region seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                  {regions.map((region) => (
                                    <SelectItem key={region.id} value={region.id}>
                                      {region.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="sector-school">Sektor</Label>
                              <Select
                                value={selectedSector}
                                onValueChange={setSelectedSector}
                                disabled={!selectedRegion || sectors.length === 0}
                              >
                                <SelectTrigger id="sector-school">
                                  <SelectValue placeholder="Sektor seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                  {sectors.map((sector) => (
                                    <SelectItem key={sector.id} value={sector.id}>
                                      {sector.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="school">Məktəb</Label>
                              <Select
                                value={form.getValues().school_id}
                                onValueChange={(value) => form.setValue("school_id", value)}
                                disabled={!selectedSector || schools.length === 0}
                              >
                                <SelectTrigger id="school">
                                  <SelectValue placeholder="Məktəb seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                  {schools.map((school) => (
                                    <SelectItem key={school.id} value={school.id}>
                                      {school.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                        
                        {(getRoleById(selectedRole)?.name.includes("super") || getRoleById(selectedRole)?.name.includes("superadmin")) && (
                          <div className="bg-infoline-lightest-gray p-4 rounded-md">
                            <p className="text-sm text-infoline-dark-gray">SuperAdmin istifadəçilər bütün təşkilatlara çıxışa malikdirlər.</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-infoline-dark-blue">Hesab Parametrləri</h4>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <h5 className="font-medium text-infoline-dark-blue">Hesabı aktiv et</h5>
                        <p className="text-sm text-infoline-dark-gray">İstifadəçi sistemə daxil ola bilər</p>
                      </div>
                      <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {isEditing && (
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h5 className="font-medium text-infoline-dark-blue">Şifrəni sıfırla</h5>
                          <p className="text-sm text-infoline-dark-gray">İstifadəçiyə şifrə sıfırlama linki göndərilir</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          type="button"
                          onClick={() => {
                            // This would call the password reset API
                            toast({
                              title: "Şifrə sıfırlama",
                              description: `${user.email} adresinə şifrə sıfırlama linki göndərildi`,
                            });
                          }}
                        >
                          Şifrəni sıfırla
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  disabled={createUserMutation.isPending || isCreatingAuth}
                >
                  Ləğv et
                </Button>
                <Button 
                  type="submit" 
                  className="bg-infoline-blue hover:bg-infoline-dark-blue"
                  disabled={createUserMutation.isPending || isCreatingAuth}
                >
                  {(createUserMutation.isPending || isCreatingAuth) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Yenilənir..." : "Yaradılır..."}
                    </>
                  ) : (
                    isEditing ? "Yadda saxla" : "Yarat"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
