
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
export type { 
  UserType as User, 
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
  // Add missing methods for compatibility
  deleteUser: (userId: string) => {
    console.warn('deleteUser is deprecated and will be removed in a future version');
    return userService.deleteUserById(userId);
  },
  blockUser: (userId: string) => {
    console.warn('blockUser is deprecated and will be removed in a future version');
    return userService.updateUser(userId, { is_active: false });
  },
  resetPassword: (email: string) => {
    console.warn('resetPassword is deprecated and will be removed in a future version');
    return userService.resetUserPassword(email);
  },
  getRoles: () => {
    console.warn('getRoles is deprecated and will be removed in a future version');
    return userService.getUserRoles();
  },
  getRegions: () => {
    console.warn('getRegions is deprecated and will be removed in a future version');
    return userService.getUserRegions();
  },
  getSectors: (regionId?: string) => {
    console.warn('getSectors is deprecated and will be removed in a future version');
    return userService.getUserSectors(regionId);
  },
  getSchools: (sectorId?: string) => {
    console.warn('getSchools is deprecated and will be removed in a future version');
    return userService.getUserSchools(sectorId);
  }
};

// Export the enhanced service as the default export
export default enhancedUserService;
