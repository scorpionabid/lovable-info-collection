
import { User } from "@/supabase/types";

// Get the display name for a user
export const getUserDisplayName = (user: User): string => {
  if (!user) return 'Unknown User';
  return `${user.first_name} ${user.last_name}`;
};

// Get the entity name (region, sector, or school) for a user
export const getEntityName = (user: User): string => {
  // Check if the user has relationships loaded
  if (user.roles?.name === 'SuperAdmin') {
    return 'Global';
  }
  
  // Try to get from relationships first
  if (user.roles?.name === 'RegionAdmin' && user.region) {
    return user.region.name || 'Unknown Region';
  }
  
  if (user.roles?.name === 'SectorAdmin' && user.sector) {
    return user.sector.name || 'Unknown Sector';
  }
  
  if (user.roles?.name === 'SchoolAdmin' && user.school) {
    return user.school.name || 'Unknown School';
  }
  
  // Fallback to just showing the role without the entity
  return user.roles?.name || 'Unknown Role';
};

// Get role display name
export const getRoleDisplayName = (user: User): string => {
  if (!user || !user.roles) {
    return 'Unknown Role';
  }
  
  return user.roles.name || 'Unknown Role';
};

// Get role color class based on role name
export const getRoleColorClass = (user: User): string => {
  const roleName = user.roles?.name || '';
  
  switch (roleName.toLowerCase()) {
    case 'superadmin':
      return 'bg-purple-500 text-white';
    case 'regionadmin':
      return 'bg-blue-500 text-white';
    case 'sectoradmin':
      return 'bg-green-500 text-white';
    case 'schooladmin':
      return 'bg-yellow-500 text-black';
    default:
      return 'bg-gray-500 text-white';
  }
};
