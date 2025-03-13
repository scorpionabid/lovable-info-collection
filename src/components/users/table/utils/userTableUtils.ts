
import { User } from "@/services/supabase/user/types";

export const getUserRole = (user: User): string => {
  if (user.roles) {
    return user.roles.name;
  }
  if (user.role) {
    return user.role;
  }
  return "Unknown Role";
};

export const getUserStatus = (user: User): string => {
  return user.is_active ? "active" : "inactive";
};

export const getEntityName = (entity: any): string => {
  if (!entity) return '';
  return entity.name || '';
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return "Never";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";
  
  // Format: DD.MM.YYYY HH:MM
  return new Intl.DateTimeFormat('az-AZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

export const getFullName = (user: User): string => {
  return `${user.first_name} ${user.last_name}`;
};
