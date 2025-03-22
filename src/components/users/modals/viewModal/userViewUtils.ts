
import { User, UserRole } from '@/lib/supabase/types/user';

/**
 * Formats the user's full name
 */
export const formatUserName = (user: User): string => {
  return `${user.first_name} ${user.last_name}`.trim();
};

/**
 * Get user role display text
 */
export const getUserRoleText = (user: User): string => {
  // Use role instead of roles, with backward compatibility
  const roleValue = user.role || user.roles || '';
  
  if (typeof roleValue === 'object' && roleValue !== null) {
    return roleValue.name || 'Unknown Role';
  }
  
  // Handle string roles
  switch (roleValue) {
    case 'super-admin':
    case 'superadmin':
      return 'Super Admin';
    case 'region-admin':
      return 'Region Admin';
    case 'sector-admin':
      return 'Sector Admin';
    case 'school-admin':
      return 'School Admin';
    default:
      return roleValue || 'Unknown Role';
  }
};

/**
 * Get user organization info text
 */
export const getUserOrganizationText = (user: User): string => {
  const roleValue = user.role || user.roles || '';

  // Super admin has no organization constraints
  if (roleValue === 'super-admin' || roleValue === 'superadmin') {
    return 'All Organizations';
  }

  // For region admins, show the region name
  if (roleValue === 'region-admin' && user.region_id) {
    return `Region: ${user.region_id}`;
  }

  // For sector admins, show the sector name
  if (roleValue === 'sector-admin' && user.sector_id) {
    return `Sector: ${user.sector_id}`;
  }

  // For school admins, show the school name
  if (roleValue === 'school-admin' && user.school_id) {
    return `School: ${user.school_id}`;
  }

  return 'No organization assigned';
};

/**
 * Returns a CSS class for the user's status
 */
export const getUserStatusClass = (user: User): string => {
  if (user.is_active) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  }
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
};

/**
 * Returns CSS classes for the role badge
 */
export const getRoleBadgeClass = (user: User): string => {
  const roleValue = user.role || user.roles || '';
  
  if (roleValue === 'super-admin' || roleValue === 'superadmin') {
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
  } else if (roleValue === 'region-admin') {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  } else if (roleValue === 'sector-admin') {
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
  } else if (roleValue === 'school-admin') {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  }
  
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};
