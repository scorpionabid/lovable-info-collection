
import { useState, useEffect, useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import authService from "@/services/api/authService";
import userService, { User } from "@/services/api/userService";
import { Form } from "@/components/ui/form";
import { UserProfileTab } from "./modals/UserProfileTab";
import { RoleTab } from "./modals/RoleTab";
import { userFormSchema, UserFormValues } from "./modals/UserFormSchema";
import { AuthContext } from "@/contexts/AuthContext";

interface UserModalProps {
  user?: User;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UserModal = ({ user, onClose, onSuccess }: UserModalProps) => {
  const [selectedRole, setSelectedRole] = useState(user?.role_id || "");
  const [selectedRegion, setSelectedRegion] = useState(user?.region_id || "");
  const [selectedSector, setSelectedSector] = useState(user?.sector_id || "");
  const [isCreatingAuth, setIsCreatingAuth] = useState(false);
  const [isCheckingUtisCode, setIsCheckingUtisCode] = useState(false);
  const { toast } = useToast();
  const isEditing = !!user;
  const { session } = useContext(AuthContext);
  const currentUserId = session?.user?.id;
  const currentUserRole = session?.user?.role;

  // Set up form with validation
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone || "",
      utis_code: user?.utis_code || "",
      role_id: user?.role_id || "",
      region_id: user?.region_id || "",
      sector_id: user?.sector_id || "",
      school_id: user?.school_id || "",
      is_active: user?.is_active !== undefined ? user.is_active : true,
      password: "",
    },
  });

  // Get the current UTIS code value
  const utisCode = form.watch("utis_code");

  // Fetch data for dropdowns
  const { data: roles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => userService.getRoles(),
  });

  const { data: regions = [], isLoading: isLoadingRegions } = useQuery({
    queryKey: ['regions', currentUserId, currentUserRole],
    queryFn: () => userService.getRegions(currentUserId, currentUserRole),
  });
  
  const { data: sectors = [], isLoading: isLoadingSectors } = useQuery({
    queryKey: ['sectors', selectedRegion, currentUserId, currentUserRole],
    queryFn: () => userService.getSectors(selectedRegion, currentUserId, currentUserRole),
    enabled: !!selectedRegion || !!currentUserId,
  });

  const { data: schools = [], isLoading: isLoadingSchools } = useQuery({
    queryKey: ['schools', selectedSector, currentUserId, currentUserRole],
    queryFn: () => userService.getSchools(selectedSector, currentUserId, currentUserRole),
    enabled: !!selectedSector || !!currentUserId,
  });

  // UTIS code uniqueness check
  useEffect(() => {
    const checkUtisCodeUniqueness = async () => {
      if (utisCode && utisCode.length >= 5) {
        setIsCheckingUtisCode(true);
        try {
          const exists = await userService.checkUtisCodeExists(utisCode, isEditing ? user?.id : undefined);
          if (exists) {
            form.setError("utis_code", { 
              type: "manual", 
              message: "Bu UTIS kodu artıq istifadə olunur" 
            });
          } else {
            form.clearErrors("utis_code");
          }
        } catch (error) {
          console.error("UTIS code check error:", error);
        } finally {
          setIsCheckingUtisCode(false);
        }
      }
    };

    const debounceCheck = setTimeout(() => {
      checkUtisCodeUniqueness();
    }, 500);

    return () => clearTimeout(debounceCheck);
  }, [utisCode, form, isEditing, user?.id]);

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      setIsCreatingAuth(true);
      
      try {
        // Check UTIS code uniqueness one more time before submission
        if (values.utis_code) {
          const exists = await userService.checkUtisCodeExists(
            values.utis_code, 
            isEditing ? user?.id : undefined
          );
          if (exists) {
            throw new Error("Bu UTIS kodu artıq istifadə olunur");
          }
        }
        
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
          // Make sure required fields are explicitly defined for TypeScript
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          role_id: values.role_id,
          utis_code: values.utis_code,
          is_active: values.is_active
        };
        
        if (isEditing && user) {
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
      
      // Clear irrelevant fields based on role
      const roleName = role.name || "";
      
      if (roleName.includes("super")) {
        // Super admin doesn't need region, sector, or school
        form.setValue("region_id", "");
        form.setValue("sector_id", "");
        form.setValue("school_id", "");
      } else if (roleName.includes("region")) {
        // Region admin needs region but not sector or school
        form.setValue("sector_id", "");
        form.setValue("school_id", "");
      } else if (roleName.includes("sector")) {
        // Sector admin needs region and sector but not school
        form.setValue("school_id", "");
      }
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
                
                <TabsContent value="profile" className="mt-4">
                  <UserProfileTab 
                    form={form} 
                    isEditing={isEditing} 
                    user={user}
                    isCheckingUtisCode={isCheckingUtisCode}
                  />
                </TabsContent>
                
                <TabsContent value="role" className="mt-4">
                  <RoleTab 
                    form={form}
                    roles={roles}
                    regions={regions}
                    sectors={sectors}
                    schools={schools}
                    selectedRole={selectedRole}
                    selectedRegion={selectedRegion}
                    selectedSector={selectedSector}
                    onRoleSelect={setSelectedRole}
                    onRegionChange={setSelectedRegion}
                    onSectorChange={setSelectedSector}
                    isEditing={isEditing}
                    user={user}
                    getRoleById={getRoleById}
                    currentUserRole={currentUserRole}
                  />
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
                  disabled={createUserMutation.isPending || isCreatingAuth || isCheckingUtisCode}
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
