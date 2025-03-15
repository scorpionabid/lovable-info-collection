
import { UserRole } from '@/hooks/types/authTypes';

/**
 * Normalizes a role string to a valid UserRole type
 */
export const getNormalizedRole = (role?: string): UserRole => {
  if (!role) return "super-admin";
  
  switch(role.toLowerCase()) {
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
      return 'super-admin'; // Default to super-admin as fallback
  }
};
