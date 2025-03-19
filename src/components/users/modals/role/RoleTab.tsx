
import React from "react";
import { OrganizationSelectionComponent } from "./OrganizationSelectionComponent";
import { User } from "@/services/userService";

interface RoleTabProps {
  roles: any[];
  regions: any[];
  sectors: any[];
  schools: any[];
  isEditing: boolean;
  user?: User;
  currentUserRole: string;
  selectedRole: string;
  selectedRegion: string;
  selectedSector: string;
  selectedSchool: string;
  onRoleChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onSectorChange: (value: string) => void;
  onSchoolChange: (value: string) => void;
}

export const RoleTab: React.FC<RoleTabProps> = ({
  roles,
  regions,
  sectors,
  schools,
  isEditing,
  user,
  currentUserRole,
  selectedRole,
  selectedRegion,
  selectedSector,
  selectedSchool,
  onRoleChange,
  onRegionChange,
  onSectorChange,
  onSchoolChange
}) => {
  return (
    <div className="space-y-6">
      <OrganizationSelectionComponent
        selectedRole={selectedRole}
        regionId={selectedRegion}
        sectorId={selectedSector}
        schoolId={selectedSchool}
        onRoleChange={onRoleChange}
        onRegionChange={onRegionChange}
        onSectorChange={onSectorChange}
        onSchoolChange={onSchoolChange}
        roles={roles}
        regions={regions}
        sectors={sectors}
        schools={schools}
      />
    </div>
  );
};
