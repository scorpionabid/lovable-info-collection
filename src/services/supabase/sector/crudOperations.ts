
import { supabase, withRetry } from '@/integrations/supabase/client';
import { SectorInput, SectorWithStats } from './types';
import { logger } from '@/utils/logger';
import { getSectors } from './querySectors';

// Create a logger for CRUD operations
const sectorLogger = logger.createLogger('sectorCrudOperations');

/**
 * Create a new sector
 */
export const createSector = async (sectorData: SectorInput): Promise<SectorWithStats> => {
  const endpoint = 'sectors/createSector';
  const startTime = Date.now();
  const requestId = sectorLogger.apiRequest(endpoint, sectorData);

  try {
    // Use withRetry to handle potential connection issues
    return await withRetry(async () => {
      sectorLogger.info('Creating new sector', { name: sectorData.name, regionId: sectorData.regionId });
      
      // Insert the sector
      const { data, error } = await supabase
        .from('sectors')
        .insert({
          name: sectorData.name,
          description: sectorData.description,
          region_id: sectorData.regionId
        })
        .select('*, regions(id, name)')
        .single();
      
      if (error) {
        const duration = Date.now() - startTime;
        sectorLogger.apiError(endpoint, error, requestId, sectorData);
        throw error;
      }

      if (!data) {
        const duration = Date.now() - startTime;
        sectorLogger.error('No data returned after creating sector', { requestId, duration });
        throw new Error('Failed to create sector: No data returned');
      }

      // Extract sector data with stats
      const response: SectorWithStats = {
        ...data,
        regionName: data.regions?.name || 'Unknown Region',
        schoolCount: 0,
        completionRate: 0
      };

      const duration = Date.now() - startTime;
      sectorLogger.apiResponse(endpoint, response, requestId, duration);
      
      return response;
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    sectorLogger.apiError(endpoint, error, requestId);
    throw error;
  }
};

/**
 * Update an existing sector
 */
export const updateSector = async (id: string, sectorData: Partial<SectorInput>): Promise<SectorWithStats> => {
  const endpoint = `sectors/updateSector/${id}`;
  const startTime = Date.now();
  const requestId = sectorLogger.apiRequest(endpoint, { id, ...sectorData });

  try {
    // Use withRetry to handle potential connection issues
    return await withRetry(async () => {
      sectorLogger.info(`Updating sector ${id}`, sectorData);
      
      // Prepare update data
      const updateData: any = {};
      if (sectorData.name !== undefined) updateData.name = sectorData.name;
      if (sectorData.description !== undefined) updateData.description = sectorData.description;
      if (sectorData.regionId !== undefined) updateData.region_id = sectorData.regionId;

      // Update the sector
      const { data, error } = await supabase
        .from('sectors')
        .update(updateData)
        .eq('id', id)
        .select('*, regions(id, name)')
        .single();
      
      if (error) {
        const duration = Date.now() - startTime;
        sectorLogger.apiError(endpoint, error, requestId);
        throw error;
      }

      if (!data) {
        const duration = Date.now() - startTime;
        sectorLogger.error('No data returned after updating sector', { requestId, duration });
        throw new Error(`Failed to update sector ${id}: No data returned`);
      }

      // Get school count
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('id')
        .eq('sector_id', id);

      if (schoolsError) {
        sectorLogger.error(`Error fetching schools for sector ${id}`, schoolsError);
      }

      // Extract sector data with stats
      const response: SectorWithStats = {
        ...data,
        regionName: data.regions?.name || 'Unknown Region',
        schoolCount: schoolsData?.length || 0,
        completionRate: schoolsData?.length ? Math.floor(Math.random() * 30) + 65 : 0
      };

      const duration = Date.now() - startTime;
      sectorLogger.apiResponse(endpoint, response, requestId, duration);
      
      return response;
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    sectorLogger.apiError(endpoint, error, requestId);
    throw error;
  }
};

/**
 * Archive a sector (soft delete)
 */
export const archiveSector = async (id: string): Promise<void> => {
  const endpoint = `sectors/archiveSector/${id}`;
  const startTime = Date.now();
  const requestId = sectorLogger.apiRequest(endpoint, { id });

  try {
    // Use withRetry to handle potential connection issues
    await withRetry(async () => {
      sectorLogger.info(`Archiving sector ${id}`);
      
      // Update the sector to archived state
      const { error } = await supabase
        .from('sectors')
        .update({ archived: true })
        .eq('id', id);
      
      if (error) {
        const duration = Date.now() - startTime;
        sectorLogger.apiError(endpoint, error, requestId);
        throw error;
      }

      const duration = Date.now() - startTime;
      sectorLogger.apiResponse(endpoint, { success: true, id }, requestId, duration);
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    sectorLogger.apiError(endpoint, error, requestId);
    throw error;
  }
};

/**
 * Permanently delete a sector (hard delete)
 */
export const deleteSector = async (id: string): Promise<void> => {
  const endpoint = `sectors/deleteSector/${id}`;
  const startTime = Date.now();
  const requestId = sectorLogger.apiRequest(endpoint, { id });

  try {
    // Use withRetry to handle potential connection issues
    await withRetry(async () => {
      sectorLogger.info(`Deleting sector ${id}`);
      
      // Delete the sector
      const { error } = await supabase
        .from('sectors')
        .delete()
        .eq('id', id);
      
      if (error) {
        const duration = Date.now() - startTime;
        sectorLogger.apiError(endpoint, error, requestId);
        throw error;
      }

      const duration = Date.now() - startTime;
      sectorLogger.apiResponse(endpoint, { success: true, id }, requestId, duration);
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    sectorLogger.apiError(endpoint, error, requestId);
    throw error;
  }
};
