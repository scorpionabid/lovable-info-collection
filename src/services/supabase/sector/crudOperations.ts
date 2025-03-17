
import { supabase } from './baseClient';
import { useLogger } from '@/hooks/useLogger';
import { SectorData } from './types';

// Logger for service operations
const logger = {
  ...useLogger('sectorService'),
  apiRequest: (endpoint: string, params?: any) => {
    try {
      console.info(`[API] Request to ${endpoint}`, { params });
    } catch (e) {
      // İstisnaları udur
    }
  },
  apiResponse: (endpoint: string, response: any, duration?: number) => {
    try {
      console.info(`[API] Response from ${endpoint} in ${duration || '?'}ms`, { 
        status: 'success',
        response 
      });
    } catch (e) {
      // İstisnaları udur
    }
  },
  apiError: (endpoint: string, error: any) => {
    try {
      console.error(`[API] Error from ${endpoint}`, error);
    } catch (e) {
      // İstisnaları udur
    }
  }
};

/**
 * Create a new sector
 */
export const createSector = async (sectorData: SectorData) => {
  const endpoint = 'sectors/create';
  const startTime = Date.now();
  logger.apiRequest(endpoint, { sectorData });
  
  try {
    // Ensure required fields are present
    if (!sectorData.name || !sectorData.region_id) {
      const error = new Error('Missing required fields: name and region_id must be provided');
      logger.apiError(endpoint, error);
      throw error;
    }
    
    const { data, error } = await supabase
      .from('sectors')
      .insert({
        name: sectorData.name,
        description: sectorData.description || null,
        region_id: sectorData.region_id
      })
      .select()
      .single();
    
    if (error) {
      logger.apiError(endpoint, error);
      throw error;
    }
    
    const duration = Date.now() - startTime;
    logger.apiResponse(endpoint, data, duration);
    
    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.apiError(endpoint, error);
    throw error;
  }
};

/**
 * Update an existing sector
 */
export const updateSector = async (id: string, sectorData: Partial<SectorData>) => {
  const endpoint = `sectors/update/${id}`;
  const startTime = Date.now();
  logger.apiRequest(endpoint, { id, sectorData });
  
  try {
    const { data, error } = await supabase
      .from('sectors')
      .update({
        name: sectorData.name,
        description: sectorData.description,
        region_id: sectorData.region_id
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      logger.apiError(endpoint, error);
      throw error;
    }
    
    const duration = Date.now() - startTime;
    logger.apiResponse(endpoint, data, duration);
    
    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.apiError(endpoint, error);
    throw error;
  }
};

/**
 * Archive a sector (soft delete)
 */
export const archiveSector = async (id: string) => {
  const endpoint = `sectors/archive/${id}`;
  const startTime = Date.now();
  logger.apiRequest(endpoint, { id });
  
  try {
    const { data, error } = await supabase
      .from('sectors')
      .update({ archived: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      logger.apiError(endpoint, error);
      throw error;
    }
    
    const duration = Date.now() - startTime;
    logger.apiResponse(endpoint, data, duration);
    
    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.apiError(endpoint, error);
    throw error;
  }
};

/**
 * Delete a sector permanently
 */
export const deleteSector = async (id: string) => {
  const endpoint = `sectors/delete/${id}`;
  const startTime = Date.now();
  logger.apiRequest(endpoint, { id });
  
  try {
    const { data, error } = await supabase
      .from('sectors')
      .delete()
      .eq('id', id);
    
    if (error) {
      logger.apiError(endpoint, error);
      throw error;
    }
    
    const duration = Date.now() - startTime;
    logger.apiResponse(endpoint, { success: true }, duration);
    
    return { success: true };
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.apiError(endpoint, error);
    throw error;
  }
};
