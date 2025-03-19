
/**
 * Region xidməti - regionları idarə etmək üçün
 */
import { supabase } from '@/lib/supabase';
import { Region, RegionWithStats } from '@/services/supabase/region/types';
import { logger } from '@/utils/logger';

/**
 * Region xidməti
 */
const regionService = {
  /**
   * Bütün regionları əldə et
   */
  getRegions: async (): Promise<RegionWithStats[]> => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*');
      
      if (error) {
        logger.error('Regionları əldə etmə xətası:', error);
        return [];
      }
      
      // Regionların statistika ilə zənginləşdirilməsi
      const regionsWithStats = (data || []).map(region => {
        // Random statistics for demo purposes
        return {
          ...region,
          // Required fields for RegionWithStats
          sectorCount: Math.floor(Math.random() * 10) + 1,
          schoolCount: Math.floor(Math.random() * 50) + 5,
          studentCount: Math.floor(Math.random() * 10000) + 500,
          teacherCount: Math.floor(Math.random() * 500) + 20,
          completionRate: Math.floor(Math.random() * 100),
          description: region.description || '',
          
          // Backward compatibility fields
          sectors_count: Math.floor(Math.random() * 10) + 1,
          schools_count: Math.floor(Math.random() * 50) + 5,
          completion_rate: Math.floor(Math.random() * 100)
        } as RegionWithStats;
      });
      
      return regionsWithStats;
    } catch (error) {
      logger.error('Regionları əldə etmə xətası:', error);
      return [];
    }
  },
  
  /**
   * Filtrlə regionları əldə et
   */
  getFilteredRegions: async (filters: any): Promise<RegionWithStats[]> => {
    try {
      let query = supabase.from('regions').select('*');
      
      // Filtrləri tətbiq et
      if (filters) {
        if (filters.name) {
          query = query.ilike('name', `%${filters.name}%`);
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
        logger.error('Regionları əldə etmə xətası:', error);
        return [];
      }
      
      // Regionların statistika ilə zənginləşdirilməsi
      const regionsWithStats = (data || []).map(region => {
        return {
          ...region,
          // Required fields for RegionWithStats
          sectorCount: Math.floor(Math.random() * 10) + 1,
          schoolCount: Math.floor(Math.random() * 50) + 5,
          studentCount: Math.floor(Math.random() * 10000) + 500,
          teacherCount: Math.floor(Math.random() * 500) + 20,
          completionRate: Math.floor(Math.random() * 100),
          description: region.description || '',
          
          // Backward compatibility fields
          sectors_count: Math.floor(Math.random() * 10) + 1,
          schools_count: Math.floor(Math.random() * 50) + 5,
          completion_rate: Math.floor(Math.random() * 100)
        } as RegionWithStats;
      });
      
      return regionsWithStats;
    } catch (error) {
      logger.error('Regionları əldə etmə xətası:', error);
      return [];
    }
  },
  
  /**
   * ID ilə regionu əldə et
   */
  getRegionById: async (id: string): Promise<RegionWithStats | null> => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        logger.error('Region əldə etmə xətası:', error);
        return null;
      }
      
      // Random statistics
      return {
        ...data,
        // Required fields for RegionWithStats
        sectorCount: Math.floor(Math.random() * 10) + 1,
        schoolCount: Math.floor(Math.random() * 50) + 5,
        studentCount: Math.floor(Math.random() * 10000) + 500,
        teacherCount: Math.floor(Math.random() * 500) + 20,
        completionRate: Math.floor(Math.random() * 100),
        description: data.description || '',
        
        // Backward compatibility
        sectors_count: Math.floor(Math.random() * 10) + 1,
        schools_count: Math.floor(Math.random() * 50) + 5,
        completion_rate: Math.floor(Math.random() * 100),
        userCount: Math.floor(Math.random() * 100) + 5
      } as RegionWithStats;
    } catch (error) {
      logger.error('Region əldə etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Yeni region yarat
   */
  createRegion: async (regionData: Partial<Region>): Promise<Region | null> => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .insert({
          name: regionData.name,
          code: regionData.code,
          description: regionData.description || ''
        })
        .select()
        .single();
      
      if (error) {
        logger.error('Region yaratma xətası:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      logger.error('Region yaratma xətası:', error);
      return null;
    }
  },
  
  /**
   * Regionu yenilə
   */
  updateRegion: async (id: string, regionData: Partial<Region>): Promise<Region | null> => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .update({
          name: regionData.name,
          code: regionData.code,
          description: regionData.description || ''
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        logger.error('Region yeniləmə xətası:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      logger.error('Region yeniləmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Regionu sil
   */
  deleteRegion: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('regions')
        .delete()
        .eq('id', id);
      
      if (error) {
        logger.error('Region silmə xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Region silmə xətası:', error);
      return false;
    }
  },
  
  /**
   * Regionları axtar
   */
  searchRegions: async (query: string): Promise<Region[]> => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .ilike('name', `%${query}%`);
      
      if (error) {
        logger.error('Region axtarışı xətası:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      logger.error('Region axtarışı xətası:', error);
      return [];
    }
  }
};

// Default export and individual methods
export default regionService;
export const { 
  getRegions, 
  getFilteredRegions, 
  getRegionById, 
  createRegion, 
  updateRegion, 
  deleteRegion, 
  searchRegions 
} = regionService;
