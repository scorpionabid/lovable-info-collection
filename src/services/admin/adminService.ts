
import { supabase } from '@/integrations/supabase/client';

export interface NewAdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  utisCode?: string;
  roleId: string;
  password?: string;
  sendEmail?: boolean;
}

export const NewAdminForm = {
  createAdmin: async (formData: NewAdminFormData) => {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password || generateRandomPassword(),
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role_id: formData.roleId
          }
        }
      });

      if (authError) throw authError;

      // Return the user data
      return {
        success: true,
        user: authData.user
      };
    } catch (error) {
      console.error('Error creating admin:', error);
      return {
        success: false,
        error
      };
    }
  }
};

// Helper function to generate a random password
function generateRandomPassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

export default {
  NewAdminForm
};
