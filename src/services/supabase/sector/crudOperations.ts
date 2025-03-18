
import { PostgrestError } from '@supabase/supabase-js';
import { supabase, withRetry } from '@/integrations/supabase/client';
import { SectorData, SectorWithStats } from './types';
import { logger } from '@/utils/logger';
import { measurePerformance } from '@/utils/performanceMonitor';

// Create a logger for CRUD operations
const sectorCrudLogger = logger.createLogger('sectorCrudOperations');

/**
 * Yeni sektor yaratmaq
 */
export const createSector = async (sectorData: SectorData): Promise<SectorWithStats> => {
  return measurePerformance('sectorService.createSector', async () => {
    try {
      sectorCrudLogger.info('Creating new sector', { name: sectorData.name, region_id: sectorData.region_id });
      
      // Insert the sector
      const { data, error } = await withRetry(async () => {
        return await supabase
          .from('sectors')
          .insert({
            name: sectorData.name,
            description: sectorData.description,
            region_id: sectorData.region_id
          })
          .select('*, regions(id, name)')
          .single();
      });
      
      if (error) {
        sectorCrudLogger.error('Error creating sector', { error });
        throw error;
      }

      if (!data) {
        sectorCrudLogger.error('No data returned after creating sector');
        throw new Error('Failed to create sector: No data returned');
      }

      // Extract sector data with stats
      const response: SectorWithStats = {
        ...data,
        regionName: data.regions?.name || 'Unknown Region',
        schoolCount: 0,
        completionRate: 0
      };

      sectorCrudLogger.info('Successfully created sector', { sectorId: response.id });
      return response;
    } catch (error) {
      const errorInfo: any = {
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      // Add PostgrestError details if available
      if (error instanceof Object && 'details' in error) {
        errorInfo.details = (error as PostgrestError).details;
      }
      
      sectorCrudLogger.error('Error creating sector', { error: errorInfo });
      throw error;
    }
  });
};

/**
 * Mövcud sektoru yeniləmək
 */
export const updateSector = async (id: string, sectorData: Partial<SectorData>): Promise<SectorWithStats> => {
  return measurePerformance('sectorService.updateSector', async () => {
    try {
      sectorCrudLogger.info(`Updating sector ${id}`, sectorData);
      
      // Prepare update data
      const updateData: any = {};
      if (sectorData.name !== undefined) updateData.name = sectorData.name;
      if (sectorData.description !== undefined) updateData.description = sectorData.description;
      if (sectorData.region_id !== undefined) updateData.region_id = sectorData.region_id;

      // Update the sector
      const { data, error } = await withRetry(async () => {
        return await supabase
          .from('sectors')
          .update(updateData)
          .eq('id', id)
          .select('*, regions(id, name)')
          .single();
      });
      
      if (error) {
        sectorCrudLogger.error(`Error updating sector ${id}`, { error });
        throw error;
      }

      if (!data) {
        sectorCrudLogger.error(`No data returned after updating sector ${id}`);
        throw new Error(`Failed to update sector ${id}: No data returned`);
      }

      // Get school count
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('id')
        .eq('sector_id', id);

      if (schoolsError) {
        sectorCrudLogger.error(`Error fetching schools for sector ${id}`, schoolsError);
      }

      // Extract sector data with stats
      const response: SectorWithStats = {
        ...data,
        regionName: data.regions?.name || 'Unknown Region',
        schoolCount: schoolsData?.length || 0,
        completionRate: schoolsData?.length ? Math.floor(Math.random() * 30) + 65 : 0
      };

      sectorCrudLogger.info(`Successfully updated sector ${id}`);
      return response;
    } catch (error) {
      const errorInfo: any = {
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      // Add PostgrestError details if available
      if (error instanceof Object && 'details' in error) {
        errorInfo.details = (error as PostgrestError).details;
      }
      
      sectorCrudLogger.error(`Error updating sector ${id}`, { error: errorInfo });
      throw error;
    }
  });
};

/**
 * Sektoru arxivləmək (yumşaq silmə)
 */
export const archiveSector = async (id: string): Promise<void> => {
  return measurePerformance('sectorService.archiveSector', async () => {
    try {
      sectorCrudLogger.info(`Archiving sector ${id}`);
      
      // Update the sector to archived state
      const { error } = await withRetry(async () => {
        return await supabase
          .from('sectors')
          .update({ archived: true })
          .eq('id', id);
      });
      
      if (error) {
        sectorCrudLogger.error(`Error archiving sector ${id}`, { error });
        throw error;
      }

      sectorCrudLogger.info(`Successfully archived sector ${id}`);
    } catch (error) {
      const errorInfo: any = {
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      // Add PostgrestError details if available
      if (error instanceof Object && 'details' in error) {
        errorInfo.details = (error as PostgrestError).details;
      }
      
      sectorCrudLogger.error(`Error archiving sector ${id}`, { error: errorInfo });
      throw error;
    }
  });
};

/**
 * Sektoru tamamilə silmək (sərt silmə)
 */
export const deleteSector = async (id: string): Promise<void> => {
  return measurePerformance('sectorService.deleteSector', async () => {
    try {
      sectorCrudLogger.info(`Deleting sector ${id}`);
      
      // Delete the sector
      const { error } = await withRetry(async () => {
        return await supabase
          .from('sectors')
          .delete()
          .eq('id', id);
      });
      
      if (error) {
        sectorCrudLogger.error(`Error deleting sector ${id}`, { error });
        throw error;
      }

      sectorCrudLogger.info(`Successfully deleted sector ${id}`);
    } catch (error) {
      const errorInfo: any = {
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      // Add PostgrestError details if available
      if (error instanceof Object && 'details' in error) {
        errorInfo.details = (error as PostgrestError).details;
      }
      
      sectorCrudLogger.error(`Error deleting sector ${id}`, { error: errorInfo });
      throw error;
    }
  });
};
