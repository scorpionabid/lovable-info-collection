
// Export the User type and all other types with proper type annotations
import { 
  User, 
  UserFilter, 
  UserResponse, 
  CreateUserDto, 
  UpdateUserDto, 
  EntityOption 
} from './types';

// Re-export all types
export type { 
  User, 
  UserFilter, 
  UserResponse, 
  CreateUserDto, 
  UpdateUserDto, 
  EntityOption 
};

// Import the actual service implementation
import userService from '../userService-bridge';

// Export the service as the default export
export default userService;
