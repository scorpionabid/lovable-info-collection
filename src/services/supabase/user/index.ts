
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
  resetPassword
} from './userQueries';
import {
  getRegions,
  getSectors,
  getSchools,
  getRoles
} from './organizationQueries';

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
  
  // Entity information
  getRegions,
  getSectors,
  getSchools,
  getRoles,
};

export type { User, UserFilters };
export default userService;
