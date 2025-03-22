
import { User } from "@/lib/supabase/types/user";
import { isRoleObject } from "@/lib/supabase/types/user/role";

// User üçün ad
export const getUserFullName = (user: User): string => {
  return `${user.first_name} ${user.last_name}`;
};

// Rollara görə əməliyyatların göstərilməsi üçün
export const showRoleBasedActions = (user: User, currentUserRole?: string): boolean => {
  if (!currentUserRole) return false;
  
  // Əgər cari istifadəçi super admin deyilsə
  if (currentUserRole !== 'super-admin') {
    // Super adminlərin digərləri tərəfindən dəyişdirilməsinə icazə verilmir
    if (isRoleObject(user.role) && user.role.name === 'super-admin') {
      return false;
    }
    if (typeof user.role === 'string' && user.role === 'super-admin') {
      return false;
    }
  }
  
  return true;
};

// İstifadəçi rollarını mətnə çevir
export const getRoleDisplayName = (user: User): string => {
  if (!user.role) return 'Unknown';
  
  if (isRoleObject(user.role)) {
    return user.role.name;
  }
  
  return String(user.role);
};

// İcazələri göstər (əgər mövcuddursa)
export const getRolePermissions = (user: User): string[] => {
  if (!user.role) return [];
  
  if (isRoleObject(user.role) && user.role.permissions) {
    if (Array.isArray(user.role.permissions)) {
      return user.role.permissions;
    }
    return [];
  }
  
  return [];
};
