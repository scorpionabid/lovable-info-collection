
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { User } from "@/services/api/userService";
import { UserProfileTab } from "./UserProfileTab";
import { RoleTab } from "./role/RoleTab";
import { userFormSchema, UserFormValues } from "./UserFormSchema";
import { useUserFormSubmit } from "../hooks/useUserFormSubmit";
import { useUtisCodeValidation } from "../hooks/useUtisCodeValidation";
import { useOrganizationData } from "../hooks/useOrganizationData";
import { LoadingState } from "./LoadingState";

interface UserModalContentProps {
  user?: User;
  onClose: () => void;
  onSuccess?: () => void;
  currentUserId?: string;
  currentUserRole?: string;
}

export const UserModalContent = ({ 
  user, 
  onClose, 
  onSuccess,
  currentUserId,
  currentUserRole
}: UserModalContentProps) => {
  const [selectedRole, setSelectedRole] = useState(user?.role_id || "");
  const [selectedRegion, setSelectedRegion] = useState(user?.region_id || "");
  const [selectedSector, setSelectedSector] = useState(user?.sector_id || "");
  const isEditing = !!user;

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

  // Use hooks for functionality
  const { createUserMutation, isCreatingAuth } = useUserFormSubmit(user, onClose, onSuccess);
  const { isCheckingUtisCode } = useUtisCodeValidation(form, isEditing, user);
  const { roles, regions, sectors, schools, isLoading, getRoleById } = useOrganizationData(
    currentUserId,
    currentUserRole,
    selectedRegion,
    selectedSector
  );

  const onSubmit = (values: UserFormValues) => {
    createUserMutation.mutate(values);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
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
              isEditing={isEditing}
              user={user}
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
  );
};
