
import authCore, { LoginCredentials, RegisterCredentials, ResetPasswordData } from './authCore';
import passwordService from './passwordService';
import userProfileService from './userProfileService';
import superAdminService from './superAdminService';

// Re-export types for easy importing
export { LoginCredentials, RegisterCredentials, ResetPasswordData };

// Combine all auth services into one export
const authService = {
  // Core auth functions
  login: authCore.login,
  register: authCore.register,
  logout: authCore.logout,
  
  // Password management
  forgotPassword: passwordService.forgotPassword,
  resetPassword: passwordService.resetPassword,
  
  // User profile
  getCurrentUser: userProfileService.getCurrentUser,
  getUserPermissions: userProfileService.getUserPermissions,
  
  // Super admin
  createSuperAdmin: superAdminService.createSuperAdmin
};

export default authService;
