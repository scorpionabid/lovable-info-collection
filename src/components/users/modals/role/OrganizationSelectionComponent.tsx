
import React from "react";
import { RoleSelection } from "../RoleSelection";
import { OrganizationSelect } from "../OrganizationSelect";
import { Separator } from "@/components/ui/separator";

interface OrganizationSelectionComponentProps {
  selectedRole: string;
  regionId: string;
  sectorId: string;
  schoolId: string;
  onRegionChange: (id: string) => void;
  onSectorChange: (id: string) => void;
  onSchoolChange: (id: any) => void;
  onRoleChange?: (roleId: string) => void;
  roles?: any[];
  regions?: any[];
  sectors?: any[];
  schools?: any[];
  isEditing?: boolean;
  user?: any;
  currentUserRole?: string;
}

export const OrganizationSelectionComponent = ({
  selectedRole,
  regionId,
  sectorId,
  schoolId,
  onRegionChange,
  onSectorChange,
  onSchoolChange,
  onRoleChange,
  roles = [],
  regions = [],
  sectors = [],
  schools = []
}: OrganizationSelectionComponentProps) => {
  // Use either selectedRole or selectedRoleId based on which was provided
  const handleRoleChange = onRoleChange || (() => {});
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium text-infoline-dark-blue">İstifadəçi Rolu</h4>
        <RoleSelection
          selectedRole={selectedRole}
          onRoleSelect={handleRoleChange}
          roles={roles}
        />
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="font-medium text-infoline-dark-blue">Əlaqəli Təşkilat</h4>
        
        {selectedRole && (
          <OrganizationSelect
            roleType={selectedRole}
            selectedRegion={regionId}
            selectedSector={sectorId}
            schoolValue={schoolId}
            onRegionChange={onRegionChange}
            onSectorChange={onSectorChange}
            onSchoolChange={onSchoolChange}
            regions={regions}
            sectors={sectors}
            schools={schools}
          />
        )}
      </div>
      
      <Separator />
    </div>
  );
};
