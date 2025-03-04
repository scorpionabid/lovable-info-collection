
import React from "react";
import { Separator } from "@/components/ui/separator";
import { RoleSelection } from "./RoleSelection";
import { OrganizationSelect } from "./OrganizationSelect";
import { AccountSettings } from "./AccountSettings";
import { UseFormReturn } from "react-hook-form";
import { UserFormValues } from "./UserFormSchema";
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

interface RoleTabProps {
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
}

export const RoleTab = ({ 
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
  getRoleById
}: RoleTabProps) => {
  const selectedRoleInfo = getRoleById(selectedRole);
  const roleType = selectedRoleInfo?.name || "";

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium text-infoline-dark-blue">İstifadəçi Rolu</h4>
        <RoleSelection
          roles={roles}
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
