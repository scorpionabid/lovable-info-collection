
export enum UserRole {
  SuperAdmin = 'super-admin',
  RegionAdmin = 'region-admin',
  SectorAdmin = 'sector-admin',
  SchoolAdmin = 'school-admin',
  Unknown = 'unknown'
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[] | any; // Permissions can be in different formats
}

export const isRoleObject = (role: string | Role): role is Role => {
  return typeof role === 'object' && role !== null && 'name' in role;
};

export const getRoleName = (role: string | Role | undefined): string => {
  if (!role) return 'Unknown';
  
  if (isRoleObject(role)) {
    return role.name;
  }
  
  return role as string;
};

export const getRolePermissions = (role: string | Role | undefined): string[] => {
  if (!role) return [];
  
  if (isRoleObject(role) && role.permissions) {
    if (Array.isArray(role.permissions)) {
      return role.permissions;
    }
    return [];
  }
  
  return [];
};
