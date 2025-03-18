
import { PostgrestError } from '@supabase/supabase-js';
import { SectorWithStats, SortParams, FilterParams, PaginationParams, SectorData } from './types';
import { getSectors, getSectorById, getSectorSchools } from './querySectors';
import { createSector, updateSector, archiveSector, deleteSector } from './crudOperations';
import { getRegionNameById } from './helperFunctions';
import { logger } from '@/utils/logger';

// Logger for the main sector module
const sectorLogger = logger.createLogger('sectorService');

// Export all query functions
export {
  getSectors,
  getSectorById,
  getSectorSchools,
  createSector,
  updateSector,
  archiveSector,
  deleteSector,
  getRegionNameById
};

// API uyğunluğu üçün adapter funksiyası
export const adaptSectorData = (apiSectorData: any): SectorData => {
  return {
    name: apiSectorData.name,
    description: apiSectorData.description,
    region_id: apiSectorData.regionId || apiSectorData.region_id
  };
};

// Səhvləri düzgün loq etmək üçün handler
export const handleSupabaseError = (error: unknown, context?: string): never => {
  const errorInfo: any = {
    message: error instanceof Error ? error.message : 'Unknown error',
    context
  };
  
  // Add PostgrestError details if available
  if (error instanceof Object && 'details' in error) {
    errorInfo.details = (error as PostgrestError).details;
  }
  
  sectorLogger.error('Supabase error', errorInfo);
  throw error;
};

// Köhnə API funksiyalarına proxy yaradaq (geriyə uyğunluq üçün)
const sectorService = {
  getSectors,
  getSectorById,
  getSectorSchools,
  createSector: (data: any) => createSector(adaptSectorData(data)),
  updateSector: (id: string, data: any) => updateSector(id, adaptSectorData(data)),
  archiveSector,
  deleteSector,
  getRegionNameById
};

export default sectorService;
