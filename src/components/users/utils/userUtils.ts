
import { User } from "@/supabase/types";
import { UserRole } from "@/hooks/types/authTypes";

// Tip çevirmə funksiyası
export const getNormalizedRole = (role?: string): UserRole => {
  if (!role) return "school-admin"; // Default

  const normalizedRole = role.toLowerCase().replace("_", "-");
  
  switch (normalizedRole) {
    case "super-admin":
    case "superadmin":
      return "super-admin";
    case "region-admin":
    case "regionadmin":
      return "region-admin";
    case "sector-admin":
    case "sectoradmin":
      return "sector-admin";
    case "school-admin":
    case "schooladmin":
      return "school-admin";
    default:
      return "school-admin";
  }
};

// İstifadəçinin aid olduğu təşkilatın adını qaytarır
export const getEntityName = (user: User): string => {
  if (!user) return "N/A";
  
  const roleName = user.roles?.name || "";
  const normalizedRole = getNormalizedRole(roleName);
  
  switch (normalizedRole) {
    case "super-admin":
      return "Sistem";
    case "region-admin":
      return user.regions?.name || "Təyin edilməyib";
    case "sector-admin":
      return user.sectors?.name || "Təyin edilməyib";
    case "school-admin":
      return user.schools?.name || "Təyin edilməyib";
    default:
      return "Təyin edilməyib";
  }
};

// İstifadəçiləri sıralama
export const sortUsers = (users: User[], sortField: string | null, sortDirection: 'asc' | 'desc' = 'asc'): User[] => {
  if (!sortField) return [...users];
  
  return [...users].sort((a, b) => {
    let valueA: any;
    let valueB: any;
    
    // Handle specific nested fields
    if (sortField === 'role') {
      valueA = a.roles?.name || '';
      valueB = b.roles?.name || '';
    } else if (sortField === 'entity') {
      valueA = getEntityName(a);
      valueB = getEntityName(b);
    } else {
      // Handle regular fields with safe access
      valueA = a[sortField as keyof User] || '';
      valueB = b[sortField as keyof User] || '';
    }
    
    // Ensure string comparison for strings
    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
    }
    if (typeof valueB === 'string') {
      valueB = valueB.toLowerCase();
    }
    
    // Sort based on direction
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
};
