
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { SectorData } from './types';

// Logger for service operations
const sectorLogger = logger.createLogger('sectorService');

/**
 * Create a new sector
 */
export const createSector = async (sectorData: SectorData) => {
  const endpoint = 'sectors/create';
  const startTime = Date.now();
  const requestId = sectorLogger.apiRequest(endpoint, { sectorData });
  
  try {
    // Ensure required fields are present
    if (!sectorData.name || !sectorData.region_id) {
      const error = new Error('Missing required fields: name and region_id must be provided');
      sectorLogger.apiError(endpoint, error, requestId);
      throw error;
    }
    
    // Log the request
    sectorLogger.debug('Creating sector with data', { 
      name: sectorData.name,
      description: sectorData.description,
      region_id: sectorData.region_id
    });
    
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
      sectorLogger.apiError(endpoint, error, requestId);
      throw error;
    }
    
    const duration = Date.now() - startTime;
    sectorLogger.apiResponse(endpoint, data, requestId, duration);
    sectorLogger.info(`Sector created successfully: ${data.name} (${data.id})`, { duration });
    
    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    sectorLogger.apiError(endpoint, error, requestId);
    throw error;
  }
};

/**
 * Update an existing sector
 */
export const updateSector = async (id: string, sectorData: Partial<SectorData>) => {
  const endpoint = `sectors/update/${id}`;
  const startTime = Date.now();
  const requestId = sectorLogger.apiRequest(endpoint, { id, sectorData });
  
  try {
    // Build update object only with properties that are provided
    const updateObj: Partial<SectorData> = {};
    
    if (sectorData.name !== undefined) updateObj.name = sectorData.name;
    if (sectorData.description !== undefined) updateObj.description = sectorData.description;
    if (sectorData.region_id !== undefined) updateObj.region_id = sectorData.region_id;
    
    // Log the update object
    sectorLogger.debug('Updating sector with data', { id, updateObj });
    
    const { data, error } = await supabase
      .from('sectors')
      .update(updateObj)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      sectorLogger.apiError(endpoint, error, requestId);
      throw error;
    }
    
    const duration = Date.now() - startTime;
    sectorLogger.apiResponse(endpoint, data, requestId, duration);
    sectorLogger.info(`Sector updated successfully: ${data.name} (${data.id})`, { duration });
    
    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    sectorLogger.apiError(endpoint, error, requestId);
    throw error;
  }
};

/**
 * Archive a sector (soft delete)
 */
export const archiveSector = async (id: string) => {
  const endpoint = `sectors/archive/${id}`;
  const startTime = Date.now();
  const requestId = sectorLogger.apiRequest(endpoint, { id });
  
  try {
    sectorLogger.debug('Archiving sector', { id });
    
    const { data, error } = await supabase
      .from('sectors')
      .update({ archived: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      sectorLogger.apiError(endpoint, error, requestId);
      throw error;
    }
    
    const duration = Date.now() - startTime;
    sectorLogger.apiResponse(endpoint, data, requestId, duration);
    sectorLogger.info(`Sector archived successfully: ${data.name} (${data.id})`, { duration });
    
    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    sectorLogger.apiError(endpoint, error, requestId);
    throw error;
  }
};

/**
 * Delete a sector permanently
 */
export const deleteSector = async (id: string) => {
  const endpoint = `sectors/delete/${id}`;
  const startTime = Date.now();
  const requestId = sectorLogger.apiRequest(endpoint, { id });
  
  try {
    sectorLogger.debug('Deleting sector', { id });
    
    const { data, error } = await supabase
      .from('sectors')
      .delete()
      .eq('id', id);
    
    if (error) {
      sectorLogger.apiError(endpoint, error, requestId);
      throw error;
    }
    
    const duration = Date.now() - startTime;
    sectorLogger.apiResponse(endpoint, { success: true }, requestId, duration);
    sectorLogger.info(`Sector deleted successfully: ${id}`, { duration });
    
    return { success: true };
  } catch (error) {
    const duration = Date.now() - startTime;
    sectorLogger.apiError(endpoint, error, requestId);
    throw error;
  }
};
