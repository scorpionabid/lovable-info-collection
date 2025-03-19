
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { SectorWithStats } from './types';

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
export const getSectorsByRegionId = async (regionId: string): Promise<SectorWithStats[]> => {
  try {
    if (!regionId) {
      return [];
    }
    
    helperLogger.info('Fetching sectors by region ID', { regionId });
    
    const { data, error } = await supabase
      .from('sectors')
      .select(`
        id,
        name,
        description,
        region_id,
        created_at,
        archived
      `)
      .eq('region_id', regionId)
      .eq('archived', false)
      .order('name', { ascending: true });
    
    if (error) {
      helperLogger.error('Error fetching sectors by region ID', { regionId, error });
      throw error;
    }
    
    // Get school counts for each sector
    const sectorsWithStats = await Promise.all(data.map(async (sector) => {
      // Get schools count
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('id')
        .eq('sector_id', sector.id)
        .eq('archived', false);
      
      if (schoolsError) {
        helperLogger.error('Error fetching school count for sector', { sectorId: sector.id, error: schoolsError });
      }
      
      const schoolCount = schoolsData?.length || 0;
      
      // Generate a random completion rate between 60 and 95% for demo purposes
      const completionRate = Math.floor(Math.random() * 35) + 60;
      
      return {
        ...sector,
        description: sector.description || '', // Ensure description is never null
        schoolCount,
        completionRate,
        // Backward compatibility fields
        schools_count: schoolCount,
        completion_rate: completionRate,
        archived: Boolean(sector.archived)
      } as SectorWithStats;
    }));
    
    helperLogger.info(`Successfully fetched ${sectorsWithStats.length} sectors for region ${regionId}`);
    return sectorsWithStats;
  } catch (error) {
    helperLogger.error('Failed to fetch sectors by region ID', { regionId, error });
    return [];
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
