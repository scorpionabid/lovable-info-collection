
import { User } from "@/services/supabase/user/types";
import { UserRole } from "@/contexts/AuthContext";

export const sortUsers = (users: User[], sortField: string | null, sortDirection: 'asc' | 'desc') => {
  if (!sortField) return [...users];
  
  return [...users].sort((a, b) => {
    let valueA: any;
    let valueB: any;
    
    switch (sortField) {
      case 'name':
        valueA = a.first_name + a.last_name;
        valueB = b.first_name + b.last_name;
        break;
      case 'email':
        valueA = a.email;
        valueB = b.email;
        break;
      case 'role':
        valueA = getRoleName(a);
        valueB = getRoleName(b);
        break;
      case 'entity':
        valueA = getEntityName(a);
        valueB = getEntityName(b);
        break;
      case 'lastActive':
        valueA = a.last_login || '';
        valueB = b.last_login || '';
        break;
      case 'status':
        valueA = a.is_active ? 1 : 0;
        valueB = b.is_active ? 1 : 0;
        break;
      default:
        return 0;
    }
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
};

export const getRoleName = (user: User) => {
  // Try to get role from roles relationship first
  const roleName = user.roles?.name || user.role;
  if (!roleName) return 'Rol təyin edilməyib';
  
  switch (roleName) {
    case 'super-admin':
    case 'superadmin':
      return 'SuperAdmin';
    case 'region-admin':
      return 'Region Admin';
    case 'sector-admin':
      return 'Sektor Admin';
    case 'school-admin':
      return 'Məktəb Admin';
    default:
      return roleName;
  }
};

export const getEntityName = (user: User) => {
  if (user.school_id) return "Məktəb";
  if (user.sector_id) return "Sektor";
  if (user.region_id) return "Region";
  if (getRoleName(user).includes("Super")) return "Bütün sistem";
  return "Təyin edilməyib";
};

export const getNormalizedRole = (role: string | undefined): UserRole | undefined => {
  if (!role) return undefined;
  
  if (role === 'superadmin') return 'super-admin';
  if (role === 'super-admin') return 'super-admin';
  
  return role as UserRole;
};
