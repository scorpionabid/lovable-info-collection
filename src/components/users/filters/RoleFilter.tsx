
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Role {
  id: string;
  name: string;
}

interface RoleFilterProps {
  roles: Role[];
  selectedRole?: string;
  onChange: (value: string | undefined) => void;
  isLoading: boolean;
}

export const RoleFilter = ({ roles, selectedRole, onChange, isLoading }: RoleFilterProps) => {
  const formatRoleName = (roleName: string) => {
    const normalizedRole = roleName.toLowerCase();
    
    if (normalizedRole.includes('super')) return 'SuperAdmin';
    if (normalizedRole.includes('region')) return 'Region Admin';
    if (normalizedRole.includes('sector')) return 'Sektor Admin';
    if (normalizedRole.includes('school')) return 'Məktəb Admin';
    
    return roleName;
  };

  return (
    <div className="space-y-2">
      <label htmlFor="role" className="text-sm font-medium text-infoline-dark-gray">
        Rol
      </label>
      <Select 
        value={selectedRole} 
        onValueChange={(value) => onChange(value === 'all' ? undefined : value)}
        disabled={isLoading}
      >
        <SelectTrigger id="role">
          <SelectValue placeholder="Bütün rollar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Bütün rollar</SelectItem>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {formatRoleName(role.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
