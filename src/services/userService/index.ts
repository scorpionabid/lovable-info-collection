
// Define and export the User type
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  role?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active: boolean;
  last_login?: string;
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
}

// Re-export the type definitions
export type { UserFilter, UserResponse, CreateUserDto, UpdateUserDto, EntityOption } from './types';

// Import the actual service implementation
import userService from './userService-bridge';

// Export the service as the default export
export default userService;
