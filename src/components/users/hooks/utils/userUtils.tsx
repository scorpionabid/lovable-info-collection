
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/services/api/userService";
import { UserFormValues } from "../../modals/UserFormSchema";

/**
 * Check if a UTIS code already exists in the database
 */
export const checkUtisCodeExists = async (
  utisCode: string, 
  userId?: string
): Promise<boolean> => {
  try {
    return await fetchUtisCodeExistence(utisCode, userId);
  } catch (error) {
    console.error('Error checking UTIS code:', error);
    throw error;
  }
};

/**
 * Fetch if a UTIS code exists in the database
 */
const fetchUtisCodeExistence = async (
  utisCode: string, 
  userId?: string
): Promise<boolean> => {
  const query = supabase
    .from('users')
    .select('id')
    .eq('utis_code', utisCode);
    
  if (userId) {
    query.neq('id', userId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(`UTIS kodu yoxlanılarkən xəta: ${error.message}`);
  }
  
  return data.length > 0;
};

/**
 * Prepare user data for create/update operations
 */
export const prepareUserData = (values: UserFormValues, userId: string): User => {
  return {
    id: userId,
    email: values.email,
    first_name: values.first_name,
    last_name: values.last_name,
    role_id: values.role_id,
    utis_code: values.utis_code || undefined,
    is_active: values.is_active,
    region_id: values.region_id || null,
    sector_id: values.sector_id || null,
    school_id: values.school_id || null,
    phone: values.phone || null
  };
};

/**
 * Create or update a user in the database
 */
export const saveUserToDatabase = async (
  userData: User, 
  isEditing: boolean
): Promise<User> => {
  try {
    if (isEditing) {
      return await updateUser(userData);
    } else {
      return await createUser(userData);
    }
  } catch (error) {
    console.error('Error saving user to database:', error);
    throw error;
  }
};

/**
 * Create a new user in the database
 */
const createUser = async (userData: User): Promise<User> => {
  // Create a new object with only the properties that the database expects
  // This ensures we don't have any type mismatches with the Supabase client
  const userDataForDb = {
    id: userData.id,
    email: userData.email,
    first_name: userData.first_name,
    last_name: userData.last_name,
    role_id: userData.role_id || '', // Ensure role_id is never undefined
    utis_code: userData.utis_code,
    is_active: userData.is_active,
    region_id: userData.region_id,
    sector_id: userData.sector_id,
    school_id: userData.school_id,
    phone: userData.phone
  };
    
  const { data, error } = await supabase
    .from('users')
    .upsert(userDataForDb, {
      onConflict: 'id'
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(`İstifadəçi yaradılarkən xəta: ${error.message}`);
  }
    
  return data as User;
};

/**
 * Update an existing user in the database
 */
const updateUser = async (userData: User): Promise<User> => {
  // Create a new object with only the properties that the database expects
  const userDataForDb = {
    id: userData.id,
    email: userData.email,
    first_name: userData.first_name,
    last_name: userData.last_name,
    role_id: userData.role_id || '', // Ensure role_id is never undefined
    utis_code: userData.utis_code,
    is_active: userData.is_active,
    region_id: userData.region_id,
    sector_id: userData.sector_id,
    school_id: userData.school_id,
    phone: userData.phone
  };
  
  const { data, error } = await supabase
    .from('users')
    .update(userDataForDb)
    .eq('id', userData.id)
    .select()
    .single();
    
  if (error) {
    throw new Error(`İstifadəçi yenilənərkən xəta: ${error.message}`);
  }
    
  return data as User;
};

/**
 * Check if a role is a school admin
 */
export const isSchoolAdminRole = async (roleId: string): Promise<boolean> => {
  try {
    const { data: roles, error } = await supabase
      .from('roles')
      .select('name')
      .eq('id', roleId)
      .single();
      
    if (error) {
      throw new Error(`Rol yoxlanılarkən xəta: ${error.message}`);
    }
      
    return roles?.name === 'school-admin';
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
};

/**
 * Create a new admin service for centralized admin operations
 */
export const findAdminBySchoolId = async (schoolId: string): Promise<User | null> => {
  try {
    // First get the role ID for 'school-admin'
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'school-admin')
      .single();
      
    if (roleError || !roleData) {
      console.error('Error finding school-admin role:', roleError);
      return null;
    }
    
    // Then find admin assigned to this school
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('school_id', schoolId)
      .eq('role_id', roleData.id)
      .maybeSingle();
      
    if (adminError) {
      console.error('Error finding admin for school:', adminError);
      return null;
    }
    
    return adminData as User | null;
  } catch (error) {
    console.error('Error in findAdminBySchoolId:', error);
    return null;
  }
};
