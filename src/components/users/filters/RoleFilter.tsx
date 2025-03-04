
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
    if (roleName === 'superadmin' || roleName === 'super-admin') 
      return 'SuperAdmin';
    if (roleName === 'region-admin')
      return 'Region Admin';
    if (roleName === 'sector-admin')
      return 'Sektor Admin';
    if (roleName === 'school-admin')
      return 'Məktəb Admin';
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
            <SelectItem key={role.id} value={role.name}>
              {formatRoleName(role.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
