
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { UserFormValues } from "../modals/UserFormSchema";
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

interface UseOrganizationSelectionProps {
  form: UseFormReturn<UserFormValues>;
  user?: User;
  roles: Role[];
}

export const useOrganizationSelection = ({
  form,
  user,
  roles
}: UseOrganizationSelectionProps) => {
  const [selectedRole, setSelectedRole] = useState(user?.role_id || "");
  const [selectedRegion, setSelectedRegion] = useState(user?.region_id || "");
  const [selectedSector, setSelectedSector] = useState(user?.sector_id || "");

  // Get the selected role details
  const getRoleById = (roleId: string) => {
    return roles.find(role => role.id === roleId);
  };

  // Filter roles based on current user's role
  const filterRolesByUserRole = (roles: Role[], currentUserRole?: string) => {
    if (!currentUserRole) return roles;
    
    return roles.filter(role => {
      // If current user is superadmin, they can assign any role
      if (currentUserRole.includes('super')) {
        return true;
      }
      
      // If current user is region admin, they can only assign sector admin or school admin
      if (currentUserRole.includes('region')) {
        return role.name.includes('sector') || role.name.includes('school');
      }
      
      // If current user is sector admin, they can only assign school admin
      if (currentUserRole.includes('sector')) {
        return role.name.includes('school');
      }
      
      // By default, show all roles
      return true;
    });
  };

  // Handle role selection
  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  // Handle region selection
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    // Reset sector when region changes
    setSelectedSector("");
  };

  // Handle sector selection
  const handleSectorChange = (value: string) => {
    setSelectedSector(value);
  };

  // Update form values when role selection changes
  useEffect(() => {
    if (selectedRole) {
      form.setValue("role_id", selectedRole);
      
      // Clear irrelevant fields based on role
      const role = roles.find(r => r.id === selectedRole);
      if (role) {
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

  return {
    selectedRole,
    selectedRegion,
    selectedSector,
    handleRoleSelect,
    handleRegionChange,
    handleSectorChange,
    getRoleById,
    filterRolesByUserRole
  };
};
