
import { supabase, withRetry } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// Create a logger for sector helper functions
const helperLogger = logger.createLogger('sectorHelpers');

/**
 * Regions dropdown üçün sorğu
 */
export const getRegionsForDropdown = async (): Promise<{ id: string; name: string }[]> => {
  try {
    helperLogger.info('Fetching regions for dropdown');
    
    const { data, error } = await supabase
      .from('regions')
      .select('id, name')
      .order('name', { ascending: true });
    
    if (error) {
      helperLogger.error('Error fetching regions for dropdown', error);
      throw error;
    }
    
    helperLogger.info(`Successfully fetched ${data?.length || 0} regions`);
    return data || [];
  } catch (error) {
    helperLogger.error('Failed to fetch regions for dropdown', error);
    throw error;
  }
};

/**
 * Konkret region üçün sektorları əldə et
 */
export const getSectorsByRegionId = async (regionId: string): Promise<{ id: string; name: string }[]> => {
  try {
    if (!regionId) {
      return [];
    }
    
    helperLogger.info('Fetching sectors by region ID', { regionId });
    
    const { data, error } = await supabase
      .from('sectors')
      .select('id, name')
      .eq('region_id', regionId)
      .eq('archived', false)
      .order('name', { ascending: true });
    
    if (error) {
      helperLogger.error('Error fetching sectors by region ID', { regionId, error });
      throw error;
    }
    
    helperLogger.info(`Successfully fetched ${data?.length || 0} sectors for region ${regionId}`);
    return data || [];
  } catch (error) {
    helperLogger.error('Failed to fetch sectors by region ID', { regionId, error });
    throw error;
  }
};

/**
 * Region adını ID ilə əldə et
 */
export const getRegionNameById = async (regionId: string): Promise<string> => {
  try {
    if (!regionId) {
      return 'N/A';
    }
    
    helperLogger.info('Fetching region name by ID', { regionId });
    
    const { data, error } = await supabase
      .from('regions')
      .select('name')
      .eq('id', regionId)
      .single();
    
    if (error) {
      helperLogger.error('Error fetching region name by ID', { regionId, error });
      return 'N/A';
    }
    
    return data?.name || 'N/A';
  } catch (error) {
    helperLogger.error('Failed to fetch region name by ID', { regionId, error });
    return 'N/A';
  }
};
