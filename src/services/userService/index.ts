
// Export the User type and all other types with proper type annotations
import { 
  User as UserType, 
  UserFilter, 
  UserResponse, 
  CreateUserDto, 
  UpdateUserDto, 
  EntityOption 
} from './types';

// Re-export all types
export type User = UserType;
export type { 
  UserFilter, 
  UserResponse, 
  CreateUserDto, 
  UpdateUserDto, 
  EntityOption 
};

// Import the actual service implementation
import userService from '../userService-bridge';

// Create enhanced userService
const enhancedUserService = {
  ...userService,
  
  // Add missing methods
  deleteUser: (userId: string) => {
    return userService.deleteUser ? 
      userService.deleteUser(userId) : 
      Promise.resolve(false);
  },
  
  blockUser: (userId: string) => {
    return userService.updateUser ? 
      userService.updateUser(userId, { isActive: false }) : 
      Promise.resolve(false);
  },
  
  activateUser: (userId: string) => {
    return userService.updateUser ? 
      userService.updateUser(userId, { isActive: true }) : 
      Promise.resolve(false);
  },
  
  resetPassword: (userId: string) => {
    return userService.resetUserPassword ? 
      userService.resetUserPassword(userId) : 
      Promise.resolve(false);
  },
  
  getRoles: () => {
    return userService.getRoles ? 
      userService.getRoles() : 
      Promise.resolve([]);
  },
  
  getRegions: (userId?: string) => {
    return userService.getRegions ? 
      userService.getRegions(userId) : 
      Promise.resolve([]);
  },
  
  getSectors: (regionId?: string) => {
    return userService.getSectors ? 
      userService.getSectors(regionId) : 
      Promise.resolve([]);
  },
  
  getSchools: (sectorId?: string) => {
    return userService.getSchools ? 
      userService.getSchools(sectorId) : 
      Promise.resolve([]);
  }
};

// Export the enhanced service as the default export
export default enhancedUserService;
