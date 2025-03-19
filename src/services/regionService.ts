/**
 * Region xidməti - regionların, sektorların və məktəblərin idarə edilməsi üçün
 */
import { supabase, withRetry } from '@/lib/supabase';
import { Region, Sector, School } from '@/types/supabase';
import { logger } from '@/utils/logger';

export interface RegionFilter {
  search?: string;
}

export interface SectorFilter {
  search?: string;
  regionId?: string;
}

export interface SchoolFilter {
  search?: string;
  regionId?: string;
  sectorId?: string;
  typeId?: string;
}

/**
 * Region xidməti
 */
const regionService = {
  /**
   * Regionları əldə et
   */
  getRegions: async (filters?: RegionFilter): Promise<Region[]> => {
    try {
      let query = supabase
        .from('regions')
        .select('*');
      
      // Filtrləri tətbiq et
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`);
      }
      
      // Sıralama
      query = query.order('name', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) {
        logger.error('Regionları əldə etmə xətası:', error);
        return [];
      }
      
      return data as Region[];
    } catch (error) {
      logger.error('Regionları əldə etmə xətası:', error);
      return [];
    }
  },
  
  /**
   * Regionu ID ilə əldə et
   */
  getRegionById: async (id: string): Promise<Region | null> => {
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
      
      return data as Region;
    } catch (error) {
      logger.error('Region əldə etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Yeni region yarat
   */
  createRegion: async (name: string, code?: string): Promise<Region | null> => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .insert({
          name,
          code
        })
        .select()
        .single();
      
      if (error) {
        logger.error('Region yaratma xətası:', error);
        return null;
      }
      
      return data as Region;
    } catch (error) {
      logger.error('Region yaratma xətası:', error);
      return null;
    }
  },
  
  /**
   * Regionu yenilə
   */
  updateRegion: async (id: string, name: string, code?: string): Promise<Region | null> => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .update({
          name,
          code,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        logger.error('Region yeniləmə xətası:', error);
        return null;
      }
      
      return data as Region;
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
      // Əvvəlcə regionla əlaqəli sektorları və məktəbləri yoxla
      const { count: sectorCount, error: sectorError } = await supabase
        .from('sectors')
        .select('id', { count: 'exact', head: true })
        .eq('region_id', id);
      
      if (sectorError) {
        logger.error('Sektor sayı əldə etmə xətası:', sectorError);
        return false;
      }
      
      if (sectorCount && sectorCount > 0) {
        logger.error(`Region silinə bilməz: ${sectorCount} əlaqəli sektor var`);
        throw new Error(`Region silinə bilməz: ${sectorCount} əlaqəli sektor var`);
      }
      
      const { count: schoolCount, error: schoolError } = await supabase
        .from('schools')
        .select('id', { count: 'exact', head: true })
        .eq('region_id', id);
      
      if (schoolError) {
        logger.error('Məktəb sayı əldə etmə xətası:', schoolError);
        return false;
      }
      
      if (schoolCount && schoolCount > 0) {
        logger.error(`Region silinə bilməz: ${schoolCount} əlaqəli məktəb var`);
        throw new Error(`Region silinə bilməz: ${schoolCount} əlaqəli məktəb var`);
      }
      
      // Regionu sil
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
   * Sektorları əldə et
   */
  getSectors: async (filters?: SectorFilter): Promise<Sector[]> => {
    try {
      let query = supabase
        .from('sectors')
        .select(`
          *,
          regions:regions(id, name)
        `);
      
      // Filtrləri tətbiq et
      if (filters) {
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`);
        }
        if (filters.regionId) {
          query = query.eq('region_id', filters.regionId);
        }
      }
      
      // Sıralama
      query = query.order('name', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) {
        logger.error('Sektorları əldə etmə xətası:', error);
        return [];
      }
      
      return data as Sector[];
    } catch (error) {
      logger.error('Sektorları əldə etmə xətası:', error);
      return [];
    }
  },
  
  /**
   * Sektoru ID ilə əldə et
   */
  getSectorById: async (id: string): Promise<Sector | null> => {
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
      
      return data as Sector;
    } catch (error) {
      logger.error('Sektor əldə etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Yeni sektor yarat
   */
  createSector: async (name: string, regionId: string, code?: string): Promise<Sector | null> => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .insert({
          name,
          region_id: regionId,
          code
        })
        .select()
        .single();
      
      if (error) {
        logger.error('Sektor yaratma xətası:', error);
        return null;
      }
      
      return data as Sector;
    } catch (error) {
      logger.error('Sektor yaratma xətası:', error);
      return null;
    }
  },
  
  /**
   * Sektoru yenilə
   */
  updateSector: async (id: string, name: string, regionId: string, code?: string): Promise<Sector | null> => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .update({
          name,
          region_id: regionId,
          code,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        logger.error('Sektor yeniləmə xətası:', error);
        return null;
      }
      
      return data as Sector;
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
      // Əvvəlcə sektorla əlaqəli məktəbləri yoxla
      const { count, error: countError } = await supabase
        .from('schools')
        .select('id', { count: 'exact', head: true })
        .eq('sector_id', id);
      
      if (countError) {
        logger.error('Məktəb sayı əldə etmə xətası:', countError);
        return false;
      }
      
      if (count && count > 0) {
        logger.error(`Sektor silinə bilməz: ${count} əlaqəli məktəb var`);
        throw new Error(`Sektor silinə bilməz: ${count} əlaqəli məktəb var`);
      }
      
      // Sektoru sil
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
   * Məktəbləri əldə et
   */
  getSchools: async (filters?: SchoolFilter): Promise<School[]> => {
    try {
      let query = supabase
        .from('schools')
        .select(`
          *,
          regions:regions(id, name),
          sectors:sectors(id, name)
        `);
      
      // Filtrləri tətbiq et
      if (filters) {
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
        }
        if (filters.regionId) {
          query = query.eq('region_id', filters.regionId);
        }
        if (filters.sectorId) {
          query = query.eq('sector_id', filters.sectorId);
        }
        if (filters.typeId) {
          query = query.eq('type_id', filters.typeId);
        }
      }
      
      // Sıralama
      query = query.order('name', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) {
        logger.error('Məktəbləri əldə etmə xətası:', error);
        return [];
      }
      
      return data as School[];
    } catch (error) {
      logger.error('Məktəbləri əldə etmə xətası:', error);
      return [];
    }
  },
  
  /**
   * Məktəbi ID ilə əldə et
   */
  getSchoolById: async (id: string): Promise<School | null> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select(`
          *,
          regions:regions(id, name),
          sectors:sectors(id, name)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        logger.error('Məktəb əldə etmə xətası:', error);
        return null;
      }
      
      return data as School;
    } catch (error) {
      logger.error('Məktəb əldə etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Yeni məktəb yarat
   */
  createSchool: async (school: Partial<School>): Promise<School | null> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .insert(school)
        .select()
        .single();
      
      if (error) {
        logger.error('Məktəb yaratma xətası:', error);
        return null;
      }
      
      return data as School;
    } catch (error) {
      logger.error('Məktəb yaratma xətası:', error);
      return null;
    }
  },
  
  /**
   * Məktəbi yenilə
   */
  updateSchool: async (id: string, school: Partial<School>): Promise<School | null> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .update({
          ...school,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        logger.error('Məktəb yeniləmə xətası:', error);
        return null;
      }
      
      return data as School;
    } catch (error) {
      logger.error('Məktəb yeniləmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Məktəbi sil
   */
  deleteSchool: async (id: string): Promise<boolean> => {
    try {
      // Əvvəlcə məktəblə əlaqəli istifadəçiləri və məlumatları yoxla
      const { count: userCount, error: userError } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('school_id', id);
      
      if (userError) {
        logger.error('İstifadəçi sayı əldə etmə xətası:', userError);
        return false;
      }
      
      if (userCount && userCount > 0) {
        logger.error(`Məktəb silinə bilməz: ${userCount} əlaqəli istifadəçi var`);
        throw new Error(`Məktəb silinə bilməz: ${userCount} əlaqəli istifadəçi var`);
      }
      
      const { count: dataCount, error: dataError } = await supabase
        .from('data')
        .select('id', { count: 'exact', head: true })
        .eq('school_id', id);
      
      if (dataError) {
        logger.error('Məlumat sayı əldə etmə xətası:', dataError);
        return false;
      }
      
      if (dataCount && dataCount > 0) {
        logger.error(`Məktəb silinə bilməz: ${dataCount} əlaqəli məlumat var`);
        throw new Error(`Məktəb silinə bilməz: ${dataCount} əlaqəli məlumat var`);
      }
      
      // Məktəbi sil
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', id);
      
      if (error) {
        logger.error('Məktəb silmə xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Məktəb silmə xətası:', error);
      return false;
    }
  },
  
  /**
   * Məktəbləri toplu şəkildə idxal et
   */
  importSchools: async (fileData: FormData): Promise<any> => {
    try {
      // FormData-dan faylı çıxar
      const file = fileData.get('file') as File;
      if (!file) throw new Error('Fayl təqdim edilməyib');
      
      // Supabase saxlama ilə faylı yüklə
      const fileName = `imports/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('school_imports')
        .upload(fileName, file);
        
      if (uploadError) {
        logger.error('Fayl yükləmə xətası:', uploadError);
        throw uploadError;
      }
      
      // Sonrakı emal üçün fayl yolunu qaytar
      return { 
        success: true, 
        message: 'Fayl uğurla yükləndi', 
        filePath: fileName 
      };
    } catch (error) {
      logger.error('Məktəb idxal xətası:', error);
      return {
        success: false,
        message: 'Məktəb idxal xətası',
        error
      };
    }
  }
};

export default regionService;
