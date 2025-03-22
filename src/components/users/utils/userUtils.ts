
import React from 'react';
import { UserRole } from "@/hooks/types/authTypes";
import { User } from "@/lib/supabase/types/user";
import { isRoleObject } from "@/lib/supabase/types/user/role";
import { Badge } from "@/components/ui/badge";

// Özəl rol adlarını əldə etmək üçün funksiya
export const getUserRoleName = (user: User): string => {
  if (!user.role_id) return 'Unknown';
  
  if (user.role && isRoleObject(user.role)) {
    return user.role.name;
  }
  
  return user.role as string;
};

// Rol əsasında badge rəngi təyin etmək
export const getUserRoleBadgeColor = (user: User): string => {
  const roleName = getUserRoleName(user).toLowerCase();
  
  if (roleName.includes('super')) {
    return 'bg-red-100 text-red-800 border-red-200';
  }
  
  if (roleName.includes('region')) {
    return 'bg-blue-100 text-blue-800 border-blue-200';
  }
  
  if (roleName.includes('sector')) {
    return 'bg-purple-100 text-purple-800 border-purple-200';
  }
  
  if (roleName.includes('school')) {
    return 'bg-green-100 text-green-800 border-green-200';
  }
  
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

// İstifadəçinin rolunu əsas mətn kimi qaytarır 
export const getUserRoleText = (user: User | null): string => {
  if (!user) return 'Unknown';
  return getUserRoleName(user);
};

// İstifadəçinin təşkilatını (region, sektor, məktəb) təyin edir
export const getUserEntity = (user: User): string => {
  if (!user) return '';
  
  // Region, sektor və ya məktəbin adını göstər
  if (user.school && typeof user.school !== 'string' && user.school.name) {
    return user.school.name;
  }
  
  if (user.sector && typeof user.sector !== 'string' && user.sector.name) {
    return user.sector.name;
  }
  
  if (user.region && typeof user.region !== 'string' && user.region.name) {
    return user.region.name;
  }
  
  return '';
};

// İstifadəçi statusu əsasında badge qaytaran funksiya
export const getUserStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return React.createElement(Badge, { 
      className: "bg-green-100 text-green-800 border-green-200" 
    }, "Aktiv");
  } else {
    return React.createElement(Badge, { 
      className: "bg-red-100 text-red-800 border-red-200" 
    }, "Deaktiv");
  }
};

// İstifadəçi statusunu rəng formatında qaytarır
export const getUserStatusColor = (isActive: boolean): string => {
  return isActive 
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-red-100 text-red-800 border-red-200";
};

// İstifadəçi statusunu mətn formatında qaytarır
export const getUserStatusText = (isActive: boolean): string => {
  return isActive ? "Aktiv" : "Deaktiv";
};

// İstifadəçinin tam adını təşkilatı ilə qaytarır
export const getUserDisplayEntity = (user: User): string => {
  const entity = getUserEntity(user);
  return entity ? `${entity}` : 'Təyin edilməyib';
};

// String-i "Role" tipi kimi işləyib-işləmədiyini yoxlamaq üçün
export const isStringInRoleFormat = (value: string): boolean => {
  return /^(super_admin|region_admin|sector_admin|school_admin)$/.test(value);
};

// String-i "Role" tipi olub-olmadığını yoxlamaq üçün əlavə helper
export const validateRoleString = (value: string): boolean => {
  return /^(super_admin|region_admin|sector_admin|school_admin)$/.test(value);
};
