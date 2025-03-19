
import { User, UserFilters } from './types';
import {
  getUsers,
  getUserById,
  checkUtisCodeExists,
  createUser,
  updateUser,
  deleteUser,
  blockUser,
  activateUser,
  resetPassword,
  createUsers,
  // Organization queries
  getRegions,
  getSectors,
  getSchools,
  getRoles
} from './queries';

const userService = {
  // User management
  getUsers,
  getUserById,
  checkUtisCodeExists,
  createUser,
  updateUser,
  deleteUser,
  blockUser,
  activateUser,
  resetPassword,
  createUsers,
  
  // Entity information
  getRegions,
  getSectors,
  getSchools,
  getRoles,
};

export type { User, UserFilters };
// Export the service as default instead of trying to export User twice
export default userService;
