
import { format, parseISO } from "date-fns";
import { az } from "date-fns/locale";
import { Shield, UserCheck, Map, Building, School } from "lucide-react";
import { User } from "@/services/api/userService";

export const getInitials = (name: string, surname: string) => {
  return `${name?.charAt(0) || ""}${surname?.charAt(0) || ""}`;
};

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Heç vaxt";
  try {
    return format(parseISO(dateString), "dd MMMM yyyy, HH:mm", { locale: az });
  } catch (error) {
    return "Tarix xətası";
  }
};

export const getRoleIcon = (role: string | undefined) => {
  if (!role) return UserCheck;
  
  if (role.includes("super")) return Shield;
  if (role.includes("region")) return Map;
  if (role.includes("sector")) return Building;
  return School;
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

export const getRoleColor = (role: string | undefined) => {
  if (!role) return 'bg-gray-100 text-gray-800';
  
  if (role.includes("super")) return 'bg-red-100 text-red-800';
  if (role.includes("region")) return 'bg-blue-100 text-blue-800';
  if (role.includes("sector")) return 'bg-green-100 text-green-800';
  return 'bg-purple-100 text-purple-800';
};
