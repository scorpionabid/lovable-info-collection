
import { User } from "@/services/api/userService";

export const getRoleName = (user: User) => {
  // Try to get role from roles relationship first
  const roleName = user.roles?.name || user.role;
  if (!roleName) return 'Unknown role';
  
  switch (roleName) {
    case 'super-admin':
      return 'Super Admin';
    case 'region-admin':
      return 'Region Admin';
    case 'sector-admin':
      return 'Sector Admin';
    case 'school-admin':
      return 'School Admin';
    default:
      return roleName;
  }
};

export const getEntityName = (user: User) => {
  if (user.school_id) return "School";
  if (user.sector_id) return "Sector";
  if (user.region_id) return "Region";
  if (getRoleName(user).includes("Super")) return "System";
  return "Not assigned";
};

export const getStatusColor = (isActive: boolean) => {
  return isActive ? 'green' : 'red';
};

export const getStatusText = (isActive: boolean) => {
  return isActive ? 'Active' : 'Inactive';
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleString();
};

// Helper function to filter users by search term
export const filterUsersBySearchTerm = (users: User[], searchTerm: string) => {
  if (!searchTerm) return users;
  
  const lowerCaseSearch = searchTerm.toLowerCase();
  
  return users.filter(user => 
    user.first_name.toLowerCase().includes(lowerCaseSearch) ||
    user.last_name.toLowerCase().includes(lowerCaseSearch) ||
    user.email.toLowerCase().includes(lowerCaseSearch) ||
    getRoleName(user).toLowerCase().includes(lowerCaseSearch)
  );
};
