
import authService from '../services/api/authService';

export const createSuperAdmin = async () => {
  try {
    const result = await authService.createSuperAdmin();
    return result;
  } catch (error) {
    console.error('Error creating superadmin account:', error);
    return { 
      success: false, 
      message: "Error creating superadmin account: " + (error instanceof Error ? error.message : "Unknown error"),
      error 
    };
  }
};
