
// This file is now just a re-export from the modular auth services
// for backward compatibility
import authService, { LoginCredentials, RegisterCredentials, ResetPasswordData } from './auth';

export type { LoginCredentials, RegisterCredentials, ResetPasswordData };
export default authService;
