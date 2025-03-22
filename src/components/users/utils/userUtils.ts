
import { User } from '@/lib/supabase/types/user';
import { getRoleName, isRoleObject } from '@/lib/supabase/types/user/role';

export const getUserRoleBadgeColor = (user: User) => {
  const roleName = getUserRoleName(user);
  
  switch (roleName.toLowerCase()) {
    case 'super-admin':
    case 'superadmin':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'region-admin':
    case 'regionadmin':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'sector-admin':
    case 'sectoradmin':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'school-admin':
    case 'schooladmin':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getUserRoleName = (user: User): string => {
  // First try to get from the roles property
  if (user.roles) {
    if (isRoleObject(user.roles)) {
      return user.roles.name;
    }
    return user.roles as string;
  }
  
  // Fallback to role property
  if (user.role) {
    return user.role;
  }
  
  // Fallback to userRole property
  if (user.userRole) {
    return user.userRole;
  }
  
  return 'Unknown';
};

export const getUserDisplayEntity = (user: User): string => {
  if (user.region) {
    return `Region: ${user.region}`;
  } else if (user.sector) {
    return `Sektor: ${user.sector}`;
  } else if (user.school) {
    return `Məktəb: ${user.school}`;
  }
  return '-';
};

export const getUserStatusBadgeColor = (status: boolean): string => {
  return status
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-red-100 text-red-800 border-red-200';
};

export const getUserStatusText = (status: boolean): string => {
  return status ? 'Aktiv' : 'Deaktiv';
};
