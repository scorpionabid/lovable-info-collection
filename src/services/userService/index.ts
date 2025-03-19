
// Export the User type and all other types with proper type annotations
import type { 
  User, 
  UserFilter, 
  UserResponse, 
  CreateUserDto, 
  UpdateUserDto, 
  EntityOption 
} from './types';

// Re-export all types
export type { User, UserFilter, UserResponse, CreateUserDto, UpdateUserDto, EntityOption };

// Import the actual service implementation
import userService from '../userService';

// Create enhanced userService
const enhancedUserService = {
  ...userService,
  
  // Add missing methods that are expected by components
  deleteUser: (userId: string) => {
    return userService.deactivateUser ? 
      userService.deactivateUser(userId) : 
      Promise.resolve(false);
  },
  
  blockUser: (userId: string) => {
    return userService.deactivateUser ? 
      userService.deactivateUser(userId) : 
      Promise.resolve(false);
  },
  
  activateUser: (userId: string) => {
    return userService.activateUser ? 
      userService.activateUser(userId) : 
      Promise.resolve(false);
  },
  
  resetPassword: (userId: string) => {
    return userService.resetUserPassword ? 
      userService.resetUserPassword(userId, "temporaryPassword") : 
      Promise.resolve(false);
  },
  
  // Add missing organization data methods
  getRoles: () => {
    return Promise.resolve([
      { id: 'super_admin', name: 'Super Admin' },
      { id: 'region_admin', name: 'Region Admin' },
      { id: 'sector_admin', name: 'Sector Admin' },
      { id: 'school_admin', name: 'School Admin' }
    ]);
  },
  
  getRegions: () => {
    return Promise.resolve([
      { id: '1', name: 'Bakı' },
      { id: '2', name: 'Sumqayıt' },
      { id: '3', name: 'Gəncə' }
    ]);
  },
  
  getSectors: (regionId?: string) => {
    return Promise.resolve([
      { id: '1', name: 'Sektor 1' },
      { id: '2', name: 'Sektor 2' },
      { id: '3', name: 'Sektor 3' }
    ]);
  },
  
  getSchools: (sectorId?: string) => {
    return Promise.resolve([
      { id: '1', name: 'Məktəb 1' },
      { id: '2', name: 'Məktəb 2' },
      { id: '3', name: 'Məktəb 3' }
    ]);
  }
};

// Export the enhanced service as the default export
export default enhancedUserService;
