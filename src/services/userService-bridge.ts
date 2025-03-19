
import { 
  User as UserType, 
  UserFilter, 
  UserResponse, 
  CreateUserDto, 
  UpdateUserDto, 
  EntityOption 
} from './userService/types';

// Re-export User type
export type { UserType as User };

// Mock implementation of userService for development
const userService = {
  // Basic user operations
  getUsers: async (filters?: UserFilter): Promise<UserResponse> => {
    console.log('Getting users with filters:', filters);
    return { data: [], count: 0, error: null };
  },
  
  getUserById: async (id: string): Promise<UserType> => {
    console.log('Getting user by ID:', id);
    return {
      id,
      email: 'user@example.com',
      first_name: 'Test',
      last_name: 'User',
      role_id: 'role-id',
      is_active: true,
      created_at: new Date().toISOString()
    };
  },
  
  // Organization handling
  getRoles: async (): Promise<EntityOption[]> => {
    return [
      { id: 'super-admin', name: 'Super Admin' },
      { id: 'region-admin', name: 'Region Admin' },
      { id: 'sector-admin', name: 'Sector Admin' },
      { id: 'school-admin', name: 'School Admin' }
    ];
  },
  
  getRegions: async (userId?: string, userRole?: string): Promise<EntityOption[]> => {
    return [
      { id: 'region-1', name: 'Region 1' },
      { id: 'region-2', name: 'Region 2' }
    ];
  },
  
  getSectors: async (regionId: string, userId?: string, userRole?: string): Promise<EntityOption[]> => {
    return [
      { id: 'sector-1', name: 'Sector 1' },
      { id: 'sector-2', name: 'Sector 2' }
    ];
  },
  
  getSchools: async (sectorId: string, userId?: string, userRole?: string): Promise<EntityOption[]> => {
    return [
      { id: 'school-1', name: 'School 1' },
      { id: 'school-2', name: 'School 2' }
    ];
  },
  
  // User management
  createUser: async (userData: CreateUserDto): Promise<UserType> => {
    console.log('Creating user:', userData);
    return {
      id: 'new-user-id',
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      role_id: userData.roleId,
      region_id: userData.regionId,
      sector_id: userData.sectorId,
      school_id: userData.schoolId,
      is_active: true,
      created_at: new Date().toISOString()
    };
  },
  
  updateUser: async (id: string, userData: UpdateUserDto): Promise<UserType> => {
    console.log('Updating user:', id, userData);
    return {
      id,
      email: 'updated@example.com',
      first_name: userData.firstName || 'Updated',
      last_name: userData.lastName || 'User',
      role_id: userData.roleId || 'role-id',
      is_active: userData.isActive !== undefined ? userData.isActive : true,
      created_at: new Date().toISOString()
    };
  },
  
  deleteUser: async (id: string): Promise<boolean> => {
    console.log('Deleting user:', id);
    return true;
  },
  
  blockUser: async (id: string): Promise<boolean> => {
    console.log('Blocking user:', id);
    return true;
  },
  
  activateUser: async (id: string): Promise<boolean> => {
    console.log('Activating user:', id);
    return true;
  },
  
  resetPassword: async (id: string): Promise<boolean> => {
    console.log('Resetting password for user:', id);
    return true;
  },
  
  resetUserPassword: async (id: string, newPassword: string): Promise<boolean> => {
    console.log('Resetting user password:', id);
    return true;
  },
  
  changePassword: async (oldPassword: string, newPassword: string): Promise<boolean> => {
    console.log('Changing password');
    return true;
  }
};

export default userService;
