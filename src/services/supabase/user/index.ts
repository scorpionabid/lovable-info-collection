
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
export { User }; // Named export for compatibility
export default userService;
