
import { supabase } from '../../supabaseClient';
import { User } from '../types';
import { TableName } from '../../constants';

export const updateUser = async (id: string, userData: Partial<User>) => {
  try {
    const { data, error } = await supabase
      .from(TableName.USERS)
      .update(userData)
      .eq('id', id)
      .select(`
        *,
        roles (
          id,
          name,
          description,
          permissions
        )
      `)
      .single();
      
    if (error) throw error;
    
    return data as User;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const { error } = await supabase
      .from(TableName.USERS)
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

export const blockUser = async (id: string) => {
  return updateUser(id, { is_active: false });
};

export const activateUser = async (id: string) => {
  return updateUser(id, { is_active: true });
};

export const resetPassword = async (id: string) => {
  try {
    const { data: user, error: userError } = await supabase
      .from(TableName.USERS)
      .select('email')
      .eq('id', id)
      .single();
      
    if (userError) throw userError;
    if (!user || !user.email) throw new Error('User not found or has no email');
    
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error resetting password for user with ID ${id}:`, error);
    throw error;
  }
};
