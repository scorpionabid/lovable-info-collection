
import { User, UserFilter, UserResponse, CreateUserDto, UpdateUserDto, EntityOption } from './types';
import userService from '../userService';

// Re-export the types for use throughout the application
export type { User, UserFilter, UserResponse, CreateUserDto, UpdateUserDto, EntityOption };

// Export the service as the default export
export default userService;
