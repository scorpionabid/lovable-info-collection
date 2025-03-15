
import { UserRole } from '@/hooks/types/authTypes';
import { User } from '@/services/api/userService';

/**
 * Normalizes a role string to a valid UserRole type
 */
export const getNormalizedRole = (role?: string): UserRole => {
  if (!role || typeof role !== 'string') {
    console.log('No role provided, defaulting to super-admin');
    return "super-admin";
  }
  
  const normalizedRole = role.toLowerCase().trim();
  
  switch(normalizedRole) {
    case 'super-admin':
    case 'superadmin':
    case 'super_admin':
      return 'super-admin';
    case 'region-admin':
    case 'regionadmin':
    case 'region_admin':
      return 'region-admin';
    case 'sector-admin':
    case 'sectoradmin':
    case 'sector_admin':
      return 'sector-admin';
    case 'school-admin':
    case 'schooladmin':
    case 'school_admin':
      return 'school-admin';
    default:
      console.warn(`Unknown role format: "${role}", defaulting to super-admin`);
      return 'super-admin'; // Default to super-admin as fallback
  }
};

/**
 * Gets the display name for a user's role
 */
export const getRoleName = (user: User): string => {
  if (user.roles && user.roles.name) {
    return user.roles.name;
  }
  // Check for roleName property first (our new property)
  if ('roleName' in user) {
    return user.roleName as string;
  }
  // Backward compatibility
  if ('role' in user) {
    return user.role as string;
  }
  return 'Rol təyin edilməyib';
};

/**
 * Gets the entity name (region, sector, or school) based on user's role
 */
export const getEntityName = (user: User): string => {
  const role = getRoleName(user).toLowerCase();
  
  if (role.includes("super")) {
    return 'Sistem';
  } else if (role.includes("region") && user.region_id) {
    return `Region: ${user.region_id}`;
  } else if (role.includes("sector") && user.sector_id) {
    return `Sektor: ${user.sector_id}`;
  } else if (role.includes("school") && user.school_id) {
    return `Məktəb: ${user.school_id}`;
  }
  
  return 'N/A';
};

/**
 * Sorts users by different criteria
 */
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
