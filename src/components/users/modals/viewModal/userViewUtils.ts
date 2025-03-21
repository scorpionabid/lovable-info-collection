
import { User } from '@/lib/supabase/types';

// Get readable user status
export const getUserStatusLabel = (user: User): string => {
  if (!user) return 'Unknown';
  return user.is_active ? 'Active' : 'Inactive';
};

// Get color class for user status
export const getUserStatusColorClass = (user: User): string => {
  if (!user) return 'bg-gray-400';
  return user.is_active ? 'bg-green-500' : 'bg-red-500';
};

// Format date for display
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Never';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return 'Invalid date';
  }
};

// Get user permissions based on role
export const getUserPermissions = (user: User): string[] => {
  if (!user || !user.roles || !user.roles.permissions) {
    return [];
  }
  
  return user.roles.permissions || [];
};

// Check if user has a specific permission
export const hasPermission = (user: User, permission: string): boolean => {
  const permissions = getUserPermissions(user);
  return permissions.includes(permission);
};

// Get user's organization details
export const getUserOrganization = (user: User): { type: string; name: string } => {
  if (!user) {
    return { type: 'Unknown', name: 'Unknown' };
  }
  
  if (user.roles?.name?.includes('Super')) {
    return { type: 'Global', name: 'System' };
  }
  
  if (user.region && user.roles?.name?.includes('Region')) {
    return { type: 'Region', name: user.region.name };
  }
  
  if (user.sector && user.roles?.name?.includes('Sector')) {
    return { type: 'Sector', name: user.sector.name };
  }
  
  if (user.school && user.roles?.name?.includes('School')) {
    return { type: 'School', name: user.school.name };
  }
  
  return { type: 'Unknown', name: 'Unknown' };
};
