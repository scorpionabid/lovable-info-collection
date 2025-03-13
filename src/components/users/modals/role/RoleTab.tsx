
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { UserFormValues } from "../UserFormSchema";
import { User } from "@/services/api/userService";
import { useOrganizationSelection } from "../../hooks/useOrganizationSelection";
import { OrganizationSelectionComponent } from "./OrganizationSelectionComponent";

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
  isEditing: boolean;
  user?: User;
  currentUserRole?: string;
}

export const RoleTab = ({ 
  form,
  roles,
  regions,
  sectors,
  schools,
  isEditing,
  user,
  currentUserRole
}: RoleTabProps) => {
  const {
    selectedRole,
    selectedRegion,
    selectedSector,
    selectedSchool, // Added this
    handleRoleSelect,
    handleRegionChange,
    handleSectorChange,
    handleSchoolChange, // Added this
    getRoleById,
    filterRolesByUserRole
  } = useOrganizationSelection({
    form,
    user,
    roles
  });

  return (
    <OrganizationSelectionComponent 
      selectedRole={selectedRole}
      regionId={selectedRegion}
      sectorId={selectedSector}
      schoolId={selectedSchool || ''}
      onRoleChange={handleRoleSelect}
      onRegionChange={handleRegionChange}
      onSectorChange={handleSectorChange}
      onSchoolChange={handleSchoolChange}
      roles={roles}
      regions={regions}
      sectors={sectors}
      schools={schools}
      isEditing={isEditing}
      user={user}
      getRoleById={getRoleById}
      currentUserRole={currentUserRole}
    />
  );
};
