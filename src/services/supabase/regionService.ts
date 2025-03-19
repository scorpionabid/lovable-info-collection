/**
 * Region servisi - regionlar üçün Supabase sorğuları
 */
import { BaseSupabaseService, QueryOptions } from './baseService';
import { Region } from '@/types/supabase';
import { logger } from '@/utils/logger';

class RegionService extends BaseSupabaseService {
  constructor() {
    super('regions');
  }
  
  /**
   * Bütün regionları əldə et
   */
  async getAllRegions(options: QueryOptions = {}): Promise<{ data: Region[] | null; error: any }> {
    logger.info('Bütün regionlar sorğulanır');
    return this.getAll<Region>('*, sectors(count)', options);
  }
  
  /**
   * ID ilə region əldə et
   */
  async getRegionById(
    id: string, 
    options: QueryOptions = {}
  ): Promise<{ data: Region | null; error: any }> {
    logger.info(`Region sorğulanır: ${id}`);
    return this.getById<Region>(id, '*, sectors(*)', options);
  }
  
  /**
   * Adına görə region axtar
   */
  async searchRegionsByName(
    name: string,
    options: QueryOptions = {}
  ): Promise<{ data: Region[] | null; error: any }> {
    logger.info(`Regiona görə axtarış: ${name}`);
    return this.getByCondition<Region>('name', `%${name}%`, 'ilike', '*', options);
  }
  
  /**
   * Yeni region yarat
   */
  async createRegion(
    regionData: Partial<Region>,
    options: QueryOptions = { useCache: false }
  ): Promise<{ data: Region | null; error: any }> {
    logger.info('Yeni region yaradılır', regionData);
    return this.create<Region>(regionData, options);
  }
  
  /**
   * Regionu yenilə
   */
  async updateRegion(
    id: string,
    regionData: Partial<Region>,
    options: QueryOptions = { useCache: false }
  ): Promise<{ data: Region | null; error: any }> {
    logger.info(`Region yenilənir: ${id}`, regionData);
    return this.update<Region>(id, regionData, options);
  }
  
  /**
   * Regionu sil
   */
  async deleteRegion(
    id: string,
    options: QueryOptions = { useCache: false }
  ): Promise<{ data: Region | null; error: any }> {
    logger.info(`Region silinir: ${id}`);
    return this.delete<Region>(id, options);
  }
  
  /**
   * Səhifələnmiş regionlar əldə et
   */
  async getPaginatedRegions(
    page: number,
    pageSize: number,
    options: QueryOptions = {}
  ): Promise<{ data: Region[] | null; error: any; count: number | null }> {
    logger.info(`Səhifələnmiş regionlar sorğulanır: səhifə ${page}, ölçü ${pageSize}`);
    return this.getPaginated<Region>(page, pageSize, '*, sectors(count)', options);
  }
  
  /**
   * Aktiv regionları əldə et
   */
  async getActiveRegions(options: QueryOptions = {}): Promise<{ data: Region[] | null; error: any }> {
    logger.info('Aktiv regionlar sorğulanır');
    return this.getByCondition<Region>('is_active', true, 'eq', '*', options);
  }
}

// Singleton instansı yarat
const regionService = new RegionService();

export default regionService;
