
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OrganizationSelectionComponent } from "./role/OrganizationSelectionComponent";
import { RoleTab } from "./role/RoleTab";
import { UserProfileTab } from "./UserProfileTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "./LoadingState";
import userService from "@/services/supabase/user";
import { CreateUserDto, UpdateUserDto, User } from "@/services/supabase/user/types";
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
  const { checkUtisCodeExists, isCheckingUtisCode } = useUtisCodeValidation();
  
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
        is_active: user.is_active,
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
      onClose();
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
                isEditing={isEditMode}
                user={user}
                isCheckingUtisCode={isCheckingUtisCode}
                email={formData.email}
                firstName={formData.first_name}
                lastName={formData.last_name}
                phone={formData.phone || ''}
                utisCode={formData.utis_code || ''}
                password={formData.password || ''}
                onEmailChange={(value) => updateFormData('email', value)}
                onFirstNameChange={(value) => updateFormData('first_name', value)}
                onLastNameChange={(value) => updateFormData('last_name', value)}
                onPhoneChange={(value) => updateFormData('phone', value)}
                onUtisCodeChange={(value) => updateFormData('utis_code', value)}
                onPasswordChange={(value) => updateFormData('password', value)}
              />
            </TabsContent>
            
            <TabsContent value="role" className="space-y-4 py-4">
              <OrganizationSelectionComponent
                selectedRole={formData.role_id}
                regionId={formData.region_id || ''}
                sectorId={formData.sector_id || ''}
                schoolId={formData.school_id || ''}
                onRoleChange={(roleId) => updateFormData('role_id', roleId)}
                onRegionChange={(id) => updateFormData('region_id', id)}
                onSectorChange={(id) => updateFormData('sector_id', id)}
                onSchoolChange={(id) => updateFormData('school_id', id)}
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
