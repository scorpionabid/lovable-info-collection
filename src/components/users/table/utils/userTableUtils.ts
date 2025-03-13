
import { User } from "@/services/supabase/user/types";

// This function gets the role name from either roles.name or role property
export const getRoleName = (user: User): string => {
  if (user.roles && user.roles.name) {
    return user.roles.name;
  }
  if (user.role) {
    return user.role;
  }
  return 'Unknown Role';
};

// Get entity name (region, sector, or school) based on user's role
export const getEntityName = (user: User): string => {
  const role = getRoleName(user).toLowerCase();
  
  if (role.includes('super')) {
    return 'System';
  } else if (role.includes('region') && user.region_id) {
    return `Region: ${user.region_id}`;
  } else if (role.includes('sector') && user.sector_id) {
    return `Sector: ${user.sector_id}`;
  } else if (role.includes('school') && user.school_id) {
    return `School: ${user.school_id}`;
  }
  
  return 'N/A';
};

// Sort users by different criteria
export const sortUsers = (users: User[], column: string | null, direction: 'asc' | 'desc'): User[] => {
  if (!column) return users;
  
  return [...users].sort((a, b) => {
    let valueA, valueB;
    
    switch (column) {
      case 'name':
        valueA = `${a.first_name} ${a.last_name}`.toLowerCase();
        valueB = `${b.first_name} ${b.last_name}`.toLowerCase();
        break;
      case 'email':
        valueA = a.email.toLowerCase();
        valueB = b.email.toLowerCase();
        break;
      case 'role':
        valueA = getRoleName(a).toLowerCase();
        valueB = getRoleName(b).toLowerCase();
        break;
      case 'entity':
        valueA = getEntityName(a).toLowerCase();
        valueB = getEntityName(b).toLowerCase();
        break;
      case 'lastActive':
        valueA = a.last_login || '';
        valueB = b.last_login || '';
        break;
      case 'status':
        valueA = a.is_active ? 'active' : 'inactive';
        valueB = b.is_active ? 'active' : 'inactive';
        break;
      default:
        return 0;
    }
    
    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};
