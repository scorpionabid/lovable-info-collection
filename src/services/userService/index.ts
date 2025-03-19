
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

// Add missing methods to userService
const enhancedUserService = {
  ...userService,
  
  // Add missing methods for backward compatibility
  deleteUser: (userId: string) => {
    console.warn('deleteUser is deprecated and will be removed in a future version');
    return userService.deleteUser ? 
      userService.deleteUser(userId) : 
      userService.deleteUserById ? 
        userService.deleteUserById(userId) : 
        Promise.resolve(false);
  },
  
  deleteUserById: (userId: string) => {
    console.warn('deleteUserById is deprecated and will be removed in a future version');
    return userService.deleteUser ? 
      userService.deleteUser(userId) : 
      Promise.resolve(false);
  },
  
  blockUser: (userId: string) => {
    console.warn('blockUser is deprecated and will be removed in a future version');
    return userService.updateUser(userId, { isActive: false });
  },
  
  activateUser: (userId: string) => {
    console.warn('activateUser is deprecated and will be removed in a future version');
    return userService.updateUser(userId, { isActive: true });
  },
  
  resetPassword: (userId: string) => {
    console.warn('resetPassword is deprecated and will be removed in a future version');
    return userService.resetUserPassword ? 
      userService.resetUserPassword(userId) : 
      Promise.resolve(false);
  },
  
  getRoles: () => {
    console.warn('getRoles is deprecated and will be removed in a future version');
    return userService.getRoles ? 
      userService.getRoles() : 
      userService.getUserRoles ? 
        userService.getUserRoles() : 
        Promise.resolve([]);
  },
  
  getUserRoles: () => {
    console.warn('getUserRoles is deprecated and will be removed in a future version');
    return userService.getRoles ? 
      userService.getRoles() : 
      Promise.resolve([]);
  },
  
  getRegions: () => {
    console.warn('getRegions is deprecated and will be removed in a future version');
    return userService.getRegions ? 
      userService.getRegions() : 
      userService.getUserRegions ? 
        userService.getUserRegions() : 
        Promise.resolve([]);
  },
  
  getUserRegions: () => {
    console.warn('getUserRegions is deprecated and will be removed in a future version');
    return userService.getRegions ? 
      userService.getRegions() : 
      Promise.resolve([]);
  },
  
  getSectors: (regionId?: string) => {
    console.warn('getSectors is deprecated and will be removed in a future version');
    return userService.getSectors ? 
      userService.getSectors(regionId) : 
      userService.getUserSectors ? 
        userService.getUserSectors(regionId) : 
        Promise.resolve([]);
  },
  
  getUserSectors: (regionId?: string) => {
    console.warn('getUserSectors is deprecated and will be removed in a future version');
    return userService.getSectors ? 
      userService.getSectors(regionId) : 
      Promise.resolve([]);
  },
  
  getSchools: (sectorId?: string) => {
    console.warn('getSchools is deprecated and will be removed in a future version');
    return userService.getSchools ? 
      userService.getSchools(sectorId) : 
      userService.getUserSchools ? 
        userService.getUserSchools(sectorId) : 
        Promise.resolve([]);
  },
  
  getUserSchools: (sectorId?: string) => {
    console.warn('getUserSchools is deprecated and will be removed in a future version');
    return userService.getSchools ? 
      userService.getSchools(sectorId) : 
      Promise.resolve([]);
  }
};

// Export the enhanced service as the default export
export default enhancedUserService;
