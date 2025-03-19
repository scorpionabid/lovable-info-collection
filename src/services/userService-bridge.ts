
import userService from './userService';
import type { 
  UserFilter, 
  UserResponse, 
  CreateUserDto, 
  UpdateUserDto
} from './userService/types';
import { User } from './userService'; // Fixed import from './userService'

// Export the User interface properly
export type { User };

// Export other types
export type { 
  UserFilter, 
  UserResponse, 
  CreateUserDto, 
  UpdateUserDto 
};

// Entity option type for organization data
export interface EntityOption {
  id: string;
  name: string;
}

// Enhanced userService with any missing methods
const enhancedUserService = {
  ...userService,
  
  // User management methods
  deleteUser: async (userId: string): Promise<boolean> => {
    console.log(`Deleting user with ID: ${userId}`);
    return userService.deleteUser(userId);
  },
  
  blockUser: async (userId: string): Promise<boolean> => {
    console.log(`Blocking user with ID: ${userId}`);
    return userService.blockUser(userId);
  },
  
  resetPassword: async (userId: string): Promise<boolean> => {
    console.log(`Resetting password for user with ID: ${userId}`);
    return userService.resetPassword(userId);
  },

  // Organization data methods
  getRoles: async (currentUserId?: string, currentUserRole?: string): Promise<EntityOption[]> => {
    return userService.getRoles(currentUserId, currentUserRole);
  },

  getRegions: async (currentUserId?: string, currentUserRole?: string): Promise<EntityOption[]> => {
    return userService.getRegions(currentUserId, currentUserRole);
  },

  getSectors: async (regionId?: string, currentUserId?: string, currentUserRole?: string): Promise<EntityOption[]> => {
    return userService.getSectors(regionId, currentUserId, currentUserRole);
  },

  getSchools: async (sectorId?: string, currentUserId?: string, currentUserRole?: string): Promise<EntityOption[]> => {
    return userService.getSchools(sectorId, currentUserId, currentUserRole);
  }
};

export default enhancedUserService;
