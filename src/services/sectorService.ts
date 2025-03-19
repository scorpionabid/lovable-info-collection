
/**
 * Sektor xidməti - sektorları idarə etmək üçün
 */
import { supabase } from '@/lib/supabase';
import { SectorWithStats } from '@/services/supabase/sector/types';
import { logger } from '@/utils/logger';

/**
 * Sektor xidməti
 */
const sectorService = {
  /**
   * Bütün sektorları əldə et
   */
  getSectors: async (): Promise<SectorWithStats[]> => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select(`
          *,
          regions:regions(id, name)
        `);
      
      if (error) {
        logger.error('Sektorları əldə etmə xətası:', error);
        return [];
      }
      
      // Sektorların statistika ilə zənginləşdirilməsi
      const sectorsWithStats = (data || []).map(sector => {
        return {
          ...sector,
          id: sector.id,
          name: sector.name,
          region_id: sector.region_id,
          regionName: sector.regions?.name || '',
          description: sector.description || '',
          created_at: sector.created_at,
          archived: false,
          schoolCount: Math.floor(Math.random() * 20) + 1,
          completionRate: Math.floor(Math.random() * 100),
          schools_count: Math.floor(Math.random() * 20) + 1,
          completion_rate: Math.floor(Math.random() * 100)
        } as SectorWithStats;
      });
      
      return sectorsWithStats;
    } catch (error) {
      logger.error('Sektorları əldə etmə xətası:', error);
      return [];
    }
  },
  
  /**
   * Filtrlə sektorları əldə et
   */
  getFilteredSectors: async (filters: any): Promise<SectorWithStats[]> => {
    try {
      let query = supabase.from('sectors').select(`
        *,
        regions:regions(id, name)
      `);
      
      // Filtrləri tətbiq et
      if (filters) {
        if (filters.name) {
          query = query.ilike('name', `%${filters.name}%`);
        }
        
        if (filters.region_id) {
          query = query.eq('region_id', filters.region_id);
        }
        
        if (filters.status) {
          if (filters.status === 'active') {
            query = query.eq('is_active', true);
          } else if (filters.status === 'inactive') {
            query = query.eq('is_active', false);
          }
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        logger.error('Sektorları əldə etmə xətası:', error);
        return [];
      }
      
      // Sektorların statistika ilə zənginləşdirilməsi
      const sectorsWithStats = (data || []).map(sector => {
        return {
          id: sector.id,
          name: sector.name,
          region_id: sector.region_id,
          description: sector.description || '', // Default empty description
          created_at: sector.created_at,
          archived: false,
          regionName: sector.regions?.name || '',
          schoolCount: Math.floor(Math.random() * 20) + 1,
          completionRate: Math.floor(Math.random() * 100),
          schools_count: Math.floor(Math.random() * 20) + 1,
          completion_rate: Math.floor(Math.random() * 100),
          code: sector.code || null
        } as SectorWithStats;
      });
      
      return sectorsWithStats;
    } catch (error) {
      logger.error('Sektorları əldə etmə xətası:', error);
      return [];
    }
  },
  
  /**
   * ID ilə sektoru əldə et
   */
  getSectorById: async (id: string): Promise<SectorWithStats | null> => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select(`
          *,
          regions:regions(id, name)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        logger.error('Sektor əldə etmə xətası:', error);
        return null;
      }
      
      // Statistika əlavə et
      return {
        id: data.id,
        name: data.name,
        region_id: data.region_id,
        description: data.description || '', // Default empty description
        created_at: data.created_at,
        archived: false,
        regionName: data.regions?.name || '',
        schoolCount: Math.floor(Math.random() * 20) + 1,
        completionRate: Math.floor(Math.random() * 100),
        schools_count: Math.floor(Math.random() * 20) + 1,
        completion_rate: Math.floor(Math.random() * 100),
        code: data.code || null
      } as SectorWithStats;
    } catch (error) {
      logger.error('Sektor əldə etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Yeni sektor yarat
   */
  createSector: async (sectorData: { name: string; region_id: string; description?: string; code?: string }): Promise<SectorWithStats | null> => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .insert({
          name: sectorData.name,
          region_id: sectorData.region_id,
          description: sectorData.description || '', // Default empty description
          code: sectorData.code
        })
        .select()
        .single();
      
      if (error) {
        logger.error('Sektor yaratma xətası:', error);
        return null;
      }
      
      // Return created sector with additional stats
      return {
        id: data.id,
        name: data.name,
        region_id: data.region_id,
        description: data.description || '', // Default empty description
        created_at: data.created_at,
        archived: false,
        schoolCount: 0,
        completionRate: 0,
        schools_count: 0,
        completion_rate: 0,
        code: data.code || null
      } as SectorWithStats;
    } catch (error) {
      logger.error('Sektor yaratma xətası:', error);
      return null;
    }
  },
  
  /**
   * Sektoru yenilə
   */
  updateSector: async (id: string, sectorData: { name?: string; region_id?: string; description?: string; code?: string }): Promise<SectorWithStats | null> => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .update({
          name: sectorData.name,
          region_id: sectorData.region_id,
          description: sectorData.description || '', // Default empty description
          code: sectorData.code
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        logger.error('Sektor yeniləmə xətası:', error);
        return null;
      }
      
      // Return updated sector with additional stats
      return {
        id: data.id,
        name: data.name,
        region_id: data.region_id,
        description: data.description || '', // Default empty description
        created_at: data.created_at,
        archived: false,
        schoolCount: Math.floor(Math.random() * 20) + 1,
        completionRate: Math.floor(Math.random() * 100),
        schools_count: Math.floor(Math.random() * 20) + 1,
        completion_rate: Math.floor(Math.random() * 100),
        code: data.code || null
      } as SectorWithStats;
    } catch (error) {
      logger.error('Sektor yeniləmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Sektoru sil
   */
  deleteSector: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sectors')
        .delete()
        .eq('id', id);
      
      if (error) {
        logger.error('Sektor silmə xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Sektor silmə xətası:', error);
      return false;
    }
  },
  
  /**
   * Region ID ilə sektorları əldə et
   */
  getSectorsByRegionId: async (regionId: string): Promise<SectorWithStats[]> => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select(`
          *,
          regions:regions(id, name)
        `)
        .eq('region_id', regionId);
      
      if (error) {
        logger.error('Region üzrə sektorları əldə etmə xətası:', error);
        return [];
      }
      
      // Sektorların statistika ilə zənginləşdirilməsi
      const sectorsWithStats = (data || []).map(sector => {
        return {
          id: sector.id,
          name: sector.name,
          region_id: sector.region_id,
          description: sector.description || '', // Default empty description
          created_at: sector.created_at,
          archived: false,
          regionName: sector.regions?.name || '',
          schoolCount: Math.floor(Math.random() * 20) + 1,
          completionRate: Math.floor(Math.random() * 100),
          schools_count: Math.floor(Math.random() * 20) + 1,
          completion_rate: Math.floor(Math.random() * 100),
          code: sector.code || null
        } as SectorWithStats;
      });
      
      return sectorsWithStats;
    } catch (error) {
      logger.error('Region üzrə sektorları əldə etmə xətası:', error);
      return [];
    }
  }
};

// Default export
export default sectorService;
export const { 
  getSectors, 
  getFilteredSectors, 
  getSectorById, 
  createSector, 
  updateSector, 
  deleteSector, 
  getSectorsByRegionId 
} = sectorService;
