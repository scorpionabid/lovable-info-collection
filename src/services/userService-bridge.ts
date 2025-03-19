
import { userService } from "./userService";

// User interface
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  phone?: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  is_active: boolean;
  last_login?: string;
  utis_code: string;
  // Additional UI properties
  role?: string;
  region?: string;
  sector?: string;
  school?: string;
}

// Additional methods needed for userService
const enhancedUserService = {
  ...userService,
  
  // Delete a user
  deleteUser: async (userId: string) => {
    try {
      // This would normally be implemented in the backend
      console.log(`Deleting user with ID: ${userId}`);
      // Mock successful response
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
  
  // Block a user
  blockUser: async (userId: string) => {
    try {
      console.log(`Blocking user with ID: ${userId}`);
      return { success: true };
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  },
  
  // Reset password for a user
  resetPassword: async (userId: string) => {
    try {
      console.log(`Resetting password for user with ID: ${userId}`);
      return { success: true };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },
  
  // Get all roles
  getRoles: async () => {
    try {
      return [
        { id: '1', name: 'SuperAdmin' },
        { id: '2', name: 'RegionAdmin' },
        { id: '3', name: 'SectorAdmin' },
        { id: '4', name: 'SchoolAdmin' }
      ];
    } catch (error) {
      console.error('Error getting roles:', error);
      throw error;
    }
  },
  
  // Get all regions
  getRegions: async () => {
    try {
      return [
        { id: '1', name: 'Bakı' },
        { id: '2', name: 'Gəncə' },
        { id: '3', name: 'Sumqayıt' }
      ];
    } catch (error) {
      console.error('Error getting regions:', error);
      throw error;
    }
  },
  
  // Get sectors by region ID
  getSectors: async (regionId?: string) => {
    try {
      return [
        { id: '1', name: 'Sektor 1', region_id: '1' },
        { id: '2', name: 'Sektor 2', region_id: '1' },
        { id: '3', name: 'Sektor 3', region_id: '2' }
      ].filter(sector => !regionId || sector.region_id === regionId);
    } catch (error) {
      console.error('Error getting sectors:', error);
      throw error;
    }
  },
  
  // Get schools
  getSchools: async (sectorId?: string) => {
    try {
      return [
        { id: '1', name: 'Məktəb 1', sector_id: '1' },
        { id: '2', name: 'Məktəb 2', sector_id: '1' },
        { id: '3', name: 'Məktəb 3', sector_id: '2' }
      ].filter(school => !sectorId || school.sector_id === sectorId);
    } catch (error) {
      console.error('Error getting schools:', error);
      throw error;
    }
  }
};

// Export the enhanced user service
export default enhancedUserService;
export { User };
