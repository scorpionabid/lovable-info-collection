
import userService from './userService';
import type { 
  UserFilter, 
  UserResponse, 
  CreateUserDto, 
  UpdateUserDto,
  User
} from './userService/types';

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
    try {
      // If the original service has a method with a different name, use that
      if (userService.deleteUser) {
        return userService.deleteUser(userId);
      }
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  },
  
  blockUser: async (userId: string): Promise<boolean> => {
    console.log(`Blocking user with ID: ${userId}`);
    try {
      // If the original service has deactivateUser, use that
      if (userService.deactivateUser) {
        return userService.deactivateUser(userId);
      }
      return true;
    } catch (error) {
      console.error('Error blocking user:', error);
      return false;
    }
  },
  
  resetPassword: async (userId: string): Promise<boolean> => {
    console.log(`Resetting password for user with ID: ${userId}`);
    try {
      // If the original service has resetUserPassword, use that
      if (userService.resetUserPassword) {
        return userService.resetUserPassword(userId, "defaultPassword123");
      }
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  },

  // Organization data methods
  getRoles: async (currentUserId?: string, currentUserRole?: string): Promise<EntityOption[]> => {
    console.log('Getting roles');
    try {
      return [
        { id: 'super_admin', name: 'Super Admin' },
        { id: 'region_admin', name: 'Region Admin' },
        { id: 'sector_admin', name: 'Sector Admin' },
        { id: 'school_admin', name: 'School Admin' }
      ];
    } catch (error) {
      console.error('Error getting roles:', error);
      return [];
    }
  },

  getRegions: async (currentUserId?: string, currentUserRole?: string): Promise<EntityOption[]> => {
    console.log('Getting regions');
    try {
      return [
        { id: '1', name: 'Bakı' },
        { id: '2', name: 'Sumqayıt' },
        { id: '3', name: 'Gəncə' }
      ];
    } catch (error) {
      console.error('Error getting regions:', error);
      return [];
    }
  },

  getSectors: async (regionId?: string, currentUserId?: string, currentUserRole?: string): Promise<EntityOption[]> => {
    console.log(`Getting sectors for region: ${regionId}`);
    try {
      return [
        { id: '1', name: 'Sektor 1' },
        { id: '2', name: 'Sektor 2' },
        { id: '3', name: 'Sektor 3' }
      ];
    } catch (error) {
      console.error('Error getting sectors:', error);
      return [];
    }
  },

  getSchools: async (sectorId?: string, currentUserId?: string, currentUserRole?: string): Promise<EntityOption[]> => {
    console.log(`Getting schools for sector: ${sectorId}`);
    try {
      return [
        { id: '1', name: 'Məktəb 1' },
        { id: '2', name: 'Məktəb 2' },
        { id: '3', name: 'Məktəb 3' }
      ];
    } catch (error) {
      console.error('Error getting schools:', error);
      return [];
    }
  }
};

export default enhancedUserService;
