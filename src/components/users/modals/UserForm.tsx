
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OrganizationSelectionComponent } from "./role/OrganizationSelectionComponent";
import { RoleTab } from "./role/RoleTab";
import { UserProfileTab } from "./UserProfileTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "./LoadingState";
import userService, { CreateUserDto, UpdateUserDto, User } from "@/services/api/userService";
import { useUserFormSubmit } from "../hooks/useUserFormSubmit";
import { useUtisCodeValidation } from "../hooks/useUtisCodeValidation";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null;
}

export const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user
}) => {
  const [activeTab, setActiveTab] = useState("profile");
  const isEditMode = !!user;
  
  // Form state
  const [formData, setFormData] = useState<CreateUserDto>({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    role_id: '',
    region_id: '',
    sector_id: '',
    school_id: '',
    is_active: true,
    utis_code: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { checkUtisCodeExists } = useUtisCodeValidation();
  
  // Initialize form with user data if in edit mode
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || '',
        role_id: user.role_id,
        region_id: user.region_id || '',
        sector_id: user.sector_id || '',
        school_id: user.school_id || '',
        is_active: user.is_active ?? true,
        utis_code: user.utis_code || ''
      });
    }
  }, [user]);
  
  const onSubmit = async () => {
    // Validate form
    if (!formData.email || !formData.first_name || !formData.last_name || !formData.role_id) {
      toast("Bütün zəruri sahələri doldurun");
      return;
    }
    
    // Check if UTIS code is unique
    if (formData.utis_code) {
      const isUtisCodeTaken = await checkUtisCodeExists(formData.utis_code, user?.id);
      if (isUtisCodeTaken) {
        toast("UTIS kodu artıq istifadə olunur");
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode && user) {
        // Update existing user
        await userService.updateUser(user.id, formData as UpdateUserDto);
        toast("İstifadəçi uğurla yeniləndi");
      } else {
        // Create new user
        await userService.createUser(formData as CreateUserDto);
        toast("İstifadəçi uğurla yaradıldı");
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting user form:", error);
      toast("Xəta baş verdi");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const updateFormData = (key: keyof CreateUserDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'İstifadəçini redaktə et' : 'Yeni istifadəçi yarat'}
          </DialogTitle>
        </DialogHeader>
        
        {isSubmitting ? (
          <LoadingState message="İstifadəçi məlumatları işlənir..." />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="role">Rol və təşkilat</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4 py-4">
              <UserProfileTab 
                form={{
                  control: {
                    register: () => ({}),
                    handleSubmit: (fn) => fn,
                    formState: { errors: {} },
                    watch: () => ({}),
                    setValue: () => {},
                    getValues: () => ({}),
                    trigger: () => Promise.resolve(true),
                    reset: () => {},
                    setError: () => {},
                    clearErrors: () => {},
                    setFocus: () => {}
                  }
                }}
                isEditing={isEditMode}
                user={user}
                isCheckingUtisCode={false}
              />
            </TabsContent>
            
            <TabsContent value="role" className="space-y-4 py-4">
              <RoleTab
                form={{
                  control: {
                    register: () => ({}),
                    handleSubmit: (fn) => fn,
                    formState: { errors: {} },
                    watch: () => ({}),
                    setValue: () => {},
                    getValues: () => ({}),
                    trigger: () => Promise.resolve(true),
                    reset: () => {},
                    setError: () => {},
                    clearErrors: () => {},
                    setFocus: () => {}
                  }
                }}
                roles={[]}
                regions={[]}
                sectors={[]}
                schools={[]}
                isEditing={isEditMode}
                user={user}
              />
            </TabsContent>
          </Tabs>
        )}
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Ləğv et
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isEditMode ? 'Yadda saxla' : 'Yarat'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
