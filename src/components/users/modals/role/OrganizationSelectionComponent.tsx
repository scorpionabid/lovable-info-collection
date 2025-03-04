
import React from "react";
import { RoleSelection } from "../RoleSelection";
import { OrganizationSelect } from "../OrganizationSelect";
import { Separator } from "@/components/ui/separator";
import { AccountSettings } from "../AccountSettings";
import { UseFormReturn } from "react-hook-form";
import { UserFormValues } from "../UserFormSchema";
import { User } from "@/services/api/userService";

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface Region {
  id: string;
  name: string;
}

interface Sector {
  id: string;
  name: string;
}

interface School {
  id: string;
  name: string;
}

interface OrganizationSelectionComponentProps {
  form: UseFormReturn<UserFormValues>;
  roles: Role[];
  regions: Region[];
  sectors: Sector[];
  schools: School[];
  selectedRole: string;
  selectedRegion: string;
  selectedSector: string;
  onRoleSelect: (roleId: string) => void;
  onRegionChange: (value: string) => void;
  onSectorChange: (value: string) => void;
  isEditing: boolean;
  user?: User;
  getRoleById: (roleId: string) => Role | undefined;
  currentUserRole?: string;
}

export const OrganizationSelectionComponent = ({
  form,
  roles,
  regions,
  sectors,
  schools,
  selectedRole,
  selectedRegion,
  selectedSector,
  onRoleSelect,
  onRegionChange,
  onSectorChange,
  isEditing,
  user,
  getRoleById,
  currentUserRole
}: OrganizationSelectionComponentProps) => {
  const selectedRoleInfo = getRoleById(selectedRole);
  const roleType = selectedRoleInfo?.name || "";
  
  // Filter roles based on current user's role
  const filteredRoles = roles.filter(role => {
    // If current user is superadmin, they can assign any role
    if (currentUserRole && currentUserRole.includes('super')) {
      return true;
    }
    
    // If current user is region admin, they can only assign sector admin or school admin
    if (currentUserRole && currentUserRole.includes('region')) {
      return role.name.includes('sector') || role.name.includes('school');
    }
    
    // If current user is sector admin, they can only assign school admin
    if (currentUserRole && currentUserRole.includes('sector')) {
      return role.name.includes('school');
    }
    
    // By default, show all roles
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium text-infoline-dark-blue">İstifadəçi Rolu</h4>
        <RoleSelection
          roles={filteredRoles}
          selectedRole={selectedRole}
          onRoleSelect={onRoleSelect}
        />
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="font-medium text-infoline-dark-blue">Əlaqəli Təşkilat</h4>
        
        {selectedRole && (
          <OrganizationSelect
            roleType={roleType}
            regions={regions}
            sectors={sectors}
            schools={schools}
            selectedRegion={selectedRegion}
            selectedSector={selectedSector}
            onRegionChange={onRegionChange}
            onSectorChange={onSectorChange}
            onSchoolChange={(value) => form.setValue("school_id", value)}
            schoolValue={form.getValues().school_id || ""}
          />
        )}
      </div>
      
      <Separator />
      
      <AccountSettings
        form={form}
        isEditing={isEditing}
        user={user}
      />
    </div>
  );
};
