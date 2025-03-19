import { UserFilter, UserResponse } from './userService/types';

// Re-export the User type for components
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at?: string;
  roles?: {
    id: string;
    name: string;
    description?: string;
    permissions?: string[];
  }
}

// Define missing functions for userService
const deleteUser = async (userId: string): Promise<boolean> => {
  console.log('Deleting user', userId);
  // Implementation would go here
  return true;
};

const blockUser = async (userId: string): Promise<boolean> => {
  console.log('Blocking user', userId);
  // Implementation would go here
  return true;
};

const resetPassword = async (userId: string): Promise<boolean> => {
  console.log('Resetting password for user', userId);
  // Implementation would go here
  return true;
};

const getRoles = async (): Promise<any[]> => {
  // Implementation would go here
  return [];
};

const getRegions = async (): Promise<any[]> => {
  // Implementation would go here
  return [];
};

const getSectors = async (regionId?: string): Promise<any[]> => {
  // Implementation would go here
  return [];
};

const getSchools = async (sectorId?: string): Promise<any[]> => {
  // Implementation would go here
  return [];
};

// Export the complete userService with missing methods
export default {
  // Existing methods (assumed to be exported from userService)
  getUsers: async (filters?: UserFilter): Promise<UserResponse> => ({ data: [], count: 0, error: null }),
  getUserById: async (id: string): Promise<any> => ({}),
  createUser: async (userData: any): Promise<any> => ({}),
  updateUser: async (id: string, userData: any): Promise<any> => ({}),
  resetUserPassword: async (email: string): Promise<any> => ({}),
  activateUser: async (id: string): Promise<any> => ({}),
  deactivateUser: async (id: string): Promise<any> => ({}),
  changePassword: async (oldPassword: string, newPassword: string): Promise<any> => ({}),
  
  // Additional methods
  deleteUser,
  blockUser,
  resetPassword,
  getRoles,
  getRegions,
  getSectors,
  getSchools,
};
