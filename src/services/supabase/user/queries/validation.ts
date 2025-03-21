
import { supabase } from '../../supabaseClient';
import { TableName } from '../../constants';

export const checkUtisCodeExists = async (utisCode: string, userId?: string) => {
  try {
    let query = supabase
      .from(TableName.USERS)
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
