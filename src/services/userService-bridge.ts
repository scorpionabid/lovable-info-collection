
import userService from './userService';
import { User } from './userService/types';
import { supabase } from '@/integrations/supabase/client';

// This bridge file adds missing methods referenced by the components
// As a temporary solution until we properly refactor the service

export const getAllRoles = async () => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

export const getAllRegions = async () => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
};

export const getSectorsByRegion = async (regionId: string) => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .eq('region_id', regionId)
      .order('name');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching sectors:', error);
    return [];
  }
};

export const getSchoolsBySector = async (sectorId: string) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('sector_id', sectorId)
      .order('name');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching schools:', error);
    return [];
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

export const blockUser = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error blocking user:', error);
    return false;
  }
};

export const activateUser = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ is_active: true })
      .eq('id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error activating user:', error);
    return false;
  }
};

export const resetPassword = async (userId: string): Promise<boolean> => {
  // This is just a simple implementation.
  // In a real application, you should generate a token and send an email
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();
    
    if (userError || !userData) {
      console.error('Error getting user email:', userError);
      return false;
    }
    
    // In a real application, this would be replaced with a reset password API call
    console.log(`Password reset would be initiated for user email: ${userData.email}`);
    
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    return false;
  }
};

// Extend the userService with the missing methods
const extendedUserService = {
  ...userService,
  getRoles: getAllRoles,
  getRegions: getAllRegions,
  getSectors: getSectorsByRegion,
  getSchools: getSchoolsBySector,
  deleteUser,
  blockUser,
  activateUser,
  resetPassword
};

export default extendedUserService;
