
import { User } from "@/services/supabase/user/types";

// Add any table utility functions here
export const getUserRoleName = (user: User): string => {
  if (!user) return 'Unknown';
  
  const roleName = user.roles?.name || user.role;
  if (!roleName) return 'Unknown';
  
  return roleName.charAt(0).toUpperCase() + roleName.slice(1);
};

export const getUserStatus = (user: User): string => {
  return user.is_active ? 'Active' : 'Inactive';
};

export const getUserInitials = (user: User): string => {
  if (!user) return '';
  
  const firstInitial = user.first_name ? user.first_name.charAt(0) : '';
  const lastInitial = user.last_name ? user.last_name.charAt(0) : '';
  
  return (firstInitial + lastInitial).toUpperCase();
};

export const formatLastLogin = (lastLoginDate?: string): string => {
  if (!lastLoginDate) return 'Never';
  
  const date = new Date(lastLoginDate);
  return date.toLocaleString();
};
