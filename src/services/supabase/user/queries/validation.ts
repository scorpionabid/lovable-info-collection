
import { supabase } from '../../supabaseClient';

export const checkUtisCodeExists = async (utisCode: string, userId?: string) => {
  try {
    let query = supabase
      .from('users')
      .select('id')
      .eq('utis_code', utisCode);
      
    if (userId) {
      query = query.neq('id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data && data.length > 0);
  } catch (error) {
    console.error('Error checking UTIS code uniqueness:', error);
    throw error;
  }
};
