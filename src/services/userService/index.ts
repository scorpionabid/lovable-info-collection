
// Re-export the User type and all other types with proper type annotations
export type { 
  User, 
  UserFilter, 
  UserResponse, 
  CreateUserDto, 
  UpdateUserDto, 
  EntityOption 
} from './types';

// Import the actual service implementation
import userService from '../userService-bridge';

// Export the service as the default export
export default userService;
