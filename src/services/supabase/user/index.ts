
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
export { getUsers, getUserById, deleteUser }; // Buraya individual funksiya eksportları əlavə edirik
export default userService;
