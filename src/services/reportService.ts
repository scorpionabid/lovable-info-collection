/**
 * Hesabat xidməti - məlumatların təhlili və hesabat yaradılması üçün
 * 
 * Bu xidmət Supabase RPC funksiyalarından istifadə edərək hesabat yaratmaq üçün istifadə olunur.
 * Bütün hesabat funksiyaları async-dir və Promise qaytarır.
 */
import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

export interface ReportFilter {
  categoryId?: string;
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface ReportOptions {
  groupBy?: 'region' | 'sector' | 'school' | 'category' | 'status' | 'month' | 'quarter' | 'year';
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
}

export interface ReportResponse {
  data: any[] | null;
  error: any | null;
}

/**
 * RPC parametr interfeysləri
 * Bu interfeyslər Supabase RPC funksiyaları üçün parametrləri təyin edir
 */

/**
 * Kateqoriya hesabatı parametrləri
 */
export interface CategoryReportParams {
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_direction?: string;
  limit_count?: number;
}

/**
 * Region hesabatı parametrləri
 */
export interface RegionReportParams {
  category_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_direction?: string;
  limit_count?: number;
}

/**
 * Məktəb hesabatı parametrləri
 */
export interface SchoolReportParams {
  category_id?: string;
  region_id?: string;
  sector_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_direction?: string;
  limit_count?: number;
}

/**
 * Zaman hesabatı parametrləri
 */
export interface TimeReportParams {
  category_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  status?: string;
  start_date: string;
  end_date: string;
  group_by: string;
}

/**
 * Status hesabatı parametrləri
 */
export interface StatusReportParams {
  category_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * İstifadəçi aktivliyi hesabatı parametrləri
 */
export interface UserActivityParams {
  start_date: string;
}

/**
 * Hesabat xidməti - məlumatların təhlili və hesabat yaradılması üçün
 */
const reportService = {
  /**
   * Ümumi statistika hesabatını əldə edir
   * Bu funksiya ümumi sistem statistikasını qaytarır, o cümlədən:
   * - Ümumi məlumat sayı
   * - Son 30 gündə əlavə edilmiş məlumat sayı
   * - Status üzrə məlumat sayı
   * - Kateqoriya üzrə məlumat sayı
   * - Region üzrə məlumat sayı
   * @returns Ümumi statistika məlumatları
   */
  getGeneralStats: async (): Promise<any> => {
    try {
      // Toplam məlumat sayı
      const { count: totalData, error: dataError } = await supabase
        .from('data')
        .select('*', { count: 'exact', head: true });
      
      if (dataError) {
        logger.error('Məlumat sayını əldə etmə xətası:', dataError);
        return null;
      }
      
      // Toplam məktəb sayı
      const { count: totalSchools, error: schoolsError } = await supabase
        .from('schools')
        .select('*', { count: 'exact', head: true });
      
      if (schoolsError) {
        logger.error('Məktəb sayını əldə etmə xətası:', schoolsError);
        return null;
      }
      
      // Toplam kateqoriya sayı
      const { count: totalCategories, error: categoriesError } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });
      
      if (categoriesError) {
        logger.error('Kateqoriya sayını əldə etmə xətası:', categoriesError);
        return null;
      }
      
      // Toplam istifadəçi sayı
      const { count: totalUsers, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (usersError) {
        logger.error('İstifadəçi sayını əldə etmə xətası:', usersError);
        return null;
      }
      
      // Son 30 gündə əlavə edilmiş məlumatlar
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: recentData, error: recentDataError } = await supabase
        .from('data')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      if (recentDataError) {
        logger.error('Son məlumatları əldə etmə xətası:', recentDataError);
        return null;
      }
      
      // Status üzrə məlumat sayı - SQL sorğusu istifadə edərək
      const { data: statusData, error: statusError } = await (supabase as any)
        .rpc('get_status_counts');
      
      if (statusError) {
        logger.error('Status məlumatlarını əldə etmə xətası:', statusError);
        return null;
      }
      
      // Nəticəni qaytar
      return {
        totalData: totalData || 0,
        totalSchools: totalSchools || 0,
        totalCategories: totalCategories || 0,
        totalUsers: totalUsers || 0,
        recentData: recentData || 0,
        statusDistribution: statusData || []
      };
    } catch (error) {
      logger.error('Ümumi statistika əldə etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Kateqoriya hesabatı
   */
  getCategoryReport: async (
    filters?: ReportFilter,
    options?: ReportOptions
  ): Promise<ReportResponse> => {
    try {
      // Filtrləri hazırla
      const filterParams = {} as any;
      
      if (filters) {
        if (filters.regionId) {
          filterParams.region_id = filters.regionId;
        }
        
        if (filters.sectorId) {
          filterParams.sector_id = filters.sectorId;
        }
        
        if (filters.schoolId) {
          filterParams.school_id = filters.schoolId;
        }
        
        if (filters.status) {
          filterParams.status = filters.status;
        }
        
        if (filters.startDate) {
          filterParams.start_date = filters.startDate;
        }
        
        if (filters.endDate) {
          filterParams.end_date = filters.endDate;
        }
      }
      
      // Sıralama və limit parametrlərini hazırla
      if (options) {
        if (options.sortBy) {
          filterParams.sort_by = options.sortBy;
          filterParams.sort_direction = options.sortDirection || 'asc';
        }
        
        if (options.limit) {
          filterParams.limit_count = options.limit;
        }
      }
      
      // Kateqoriyalar üzrə məlumat sayını əldə et - SQL sorğusu istifadə edərək
      const { data: categoryData, error: categoryError } = await (supabase as any)
        .rpc('get_category_counts_with_filters', filterParams);
        
      if (categoryError) {
        logger.error('Kateqoriya hesabatı əldə etmə xətası:', categoryError);
        return { data: null, error: categoryError };
      }
      
      // Əlavə məlumatları əldə et
      const enhancedData = await Promise.all((categoryData || []).map(async (item) => {
        // Kateqoriya üçün tamamlanmış məlumat sayını əldə et
        const { count: completedCount, error: completedError } = await supabase
          .from('data')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', item.categories?.id)
          .eq('status', 'approved');
        
        if (completedError) {
          logger.error('Tamamlanmış məlumat sayını əldə etmə xətası:', completedError);
          return item;
        }
        
        // Kateqoriya üçün gözləyən məlumat sayını əldə et
        const { count: pendingCount, error: pendingError } = await supabase
          .from('data')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', item.categories?.id)
          .eq('status', 'pending');
        
        if (pendingError) {
          logger.error('Gözləyən məlumat sayını əldə etmə xətası:', pendingError);
          return item;
        }
        
        return {
          ...item,
          completedCount: completedCount || 0,
          pendingCount: pendingCount || 0
        };
      }));
      
      return { data: enhancedData, error: null };
    } catch (error) {
      logger.error('Kateqoriya hesabatı əldə etmə xətası:', error);
      return { data: null, error };
    }
  },
  
  /**
   * Region hesabatı
   */
  getRegionReport: async (
    filters?: ReportFilter,
    options?: ReportOptions
  ): Promise<ReportResponse> => {
    try {
      // Filtrləri hazırla
      const filterParams = {} as any;
      
      if (filters) {
        if (filters.categoryId) {
          filterParams.category_id = filters.categoryId;
        }
        
        if (filters.status) {
          filterParams.status = filters.status;
        }
        
        if (filters.startDate) {
          filterParams.start_date = filters.startDate;
        }
        
        if (filters.endDate) {
          filterParams.end_date = filters.endDate;
        }
      }
      
      // Sıralama və limit parametrlərini hazırla
      if (options) {
        if (options.sortBy) {
          filterParams.sort_by = options.sortBy;
          filterParams.sort_direction = options.sortDirection || 'asc';
        }
        
        if (options.limit) {
          filterParams.limit_count = options.limit;
        }
      }
      
      // Regionlar üzrə məlumat sayını əldə et - SQL sorğusu istifadə edərək
      const { data: regionData, error: regionError } = await (supabase as any)
        .rpc('get_region_counts_with_filters', filterParams);
        
      if (regionError) {
        logger.error('Region hesabatı əldə etmə xətası:', regionError);
        return { data: null, error: regionError };
      }
      
      // Regionlar üzrə məlumatları qruplaşdır
      const regionMap = new Map();
      
      (regionData || []).forEach(item => {
        const regionId = item.schools?.region?.id;
        const regionName = item.schools?.region?.name;
        
        if (regionId && regionName) {
          if (!regionMap.has(regionId)) {
            regionMap.set(regionId, {
              id: regionId,
              name: regionName,
              count: 0
            });
          }
          
          const regionData = regionMap.get(regionId);
          regionData.count += parseInt(item.count);
        }
      });
      
      // Regionlar üzrə əlavə məlumatları əldə et
      const enhancedData = await Promise.all(Array.from(regionMap.values()).map(async (region: any) => {
        // Region üçün məktəb sayını əldə et
        const { count: schoolCount, error: schoolError } = await supabase
          .from('schools')
          .select('*', { count: 'exact', head: true })
          .eq('region_id', region.id);
        
        if (schoolError) {
          logger.error('Məktəb sayını əldə etmə xətası:', schoolError);
          return region;
        }
        
        // Region üçün tamamlanmış məlumat sayını əldə et
        // Əvvəlcə məktəb ID-lərini əldə et
        const { data: schoolsData, error: schoolsDataError } = await supabase
          .from('schools')
          .select('id')
          .eq('region_id', region.id);
          
        if (schoolsDataError) {
          logger.error('Məktəb ID-lərini əldə etmə xətası:', schoolsDataError);
          return {
            ...region,
            schoolCount: schoolCount || 0
          };
        }
        
        const schoolIds = schoolsData?.map(school => school.id) || [];
        
        // Əgər heç bir məktəb yoxdursa, boş nəticə qaytar
        if (schoolIds.length === 0) {
          return {
            ...region,
            schoolCount: schoolCount || 0,
            completedCount: 0
          };
        }
        
        const { count: completedCount, error: completedError } = await (supabase as any)
          .from('data')
          .select('data.id', { count: 'exact', head: true })
          .eq('status', 'approved')
          .in('school_id', schoolIds);
        
        if (completedError) {
          logger.error('Tamamlanmış məlumat sayını əldə etmə xətası:', completedError);
          return {
            ...region,
            schoolCount: schoolCount || 0
          };
        }
        
        return {
          ...region,
          schoolCount: schoolCount || 0,
          completedCount: completedCount || 0
        };
      }));
      
      return { data: enhancedData, error: null };
    } catch (error) {
      logger.error('Region hesabatı əldə etmə xətası:', error);
      return { data: null, error };
    }
  },
  
  /**
   * Məktəb hesabatı
   */
  getSchoolReport: async (
    filters?: ReportFilter,
    options?: ReportOptions
  ): Promise<ReportResponse> => {
    try {
      // Filtrləri hazırla
      const filterParams = {} as any;
      
      if (filters) {
        if (filters.categoryId) {
          filterParams.category_id = filters.categoryId;
        }
        
        if (filters.regionId) {
          filterParams.region_id = filters.regionId;
        }
        
        if (filters.sectorId) {
          filterParams.sector_id = filters.sectorId;
        }
        
        if (filters.status) {
          filterParams.status = filters.status;
        }
        
        if (filters.startDate) {
          filterParams.start_date = filters.startDate;
        }
        
        if (filters.endDate) {
          filterParams.end_date = filters.endDate;
        }
      }
      
      // Sıralama və limit parametrlərini hazırla
      if (options) {
        if (options.sortBy) {
          filterParams.sort_by = options.sortBy;
          filterParams.sort_direction = options.sortDirection || 'asc';
        }
        
        if (options.limit) {
          filterParams.limit_count = options.limit;
        }
      }
      
      // Məktəblər üzrə məlumat sayını əldə et - SQL sorğusu istifadə edərək
      const { data: schoolData, error: schoolError } = await (supabase as any)
        .rpc('get_school_counts_with_filters', filterParams);
        
      if (schoolError) {
        logger.error('Məktəb hesabatı əldə etmə xətası:', schoolError);
        return { data: null, error: schoolError };
      }
      
      // Məktəblər üzrə əlavə məlumatları əldə et
      const enhancedData = await Promise.all((schoolData || []).map(async (item) => {
        const schoolId = item.schools?.id;
        
        if (!schoolId) return item;
        
        // Məktəb üçün tamamlanmış məlumat sayını əldə et
        const { count: completedCount, error: completedError } = await supabase
          .from('data')
          .select('*', { count: 'exact', head: true })
          .eq('school_id', schoolId)
          .eq('status', 'approved');
        
        if (completedError) {
          logger.error('Tamamlanmış məlumat sayını əldə etmə xətası:', completedError);
          return item;
        }
        
        // Məktəb üçün gözləyən məlumat sayını əldə et
        const { count: pendingCount, error: pendingError } = await supabase
          .from('data')
          .select('*', { count: 'exact', head: true })
          .eq('school_id', schoolId)
          .eq('status', 'pending');
        
        if (pendingError) {
          logger.error('Gözləyən məlumat sayını əldə etmə xətası:', pendingError);
          return item;
        }
        
        return {
          ...item,
          completedCount: completedCount || 0,
          pendingCount: pendingCount || 0
        };
      }));
      
      return { data: enhancedData, error: null };
    } catch (error) {
      logger.error('Məktəb hesabatı əldə etmə xətası:', error);
      return { data: null, error };
    }
  },
  
  /**
   * Zaman hesabatı
   */
  getTimeReport: async (
    filters?: ReportFilter,
    options?: ReportOptions
  ): Promise<ReportResponse> => {
    try {
      // Tarix aralığını müəyyən et
      const endDate = filters?.endDate ? new Date(filters.endDate) : new Date();
      const startDate = filters?.startDate 
        ? new Date(filters.startDate) 
        : new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
      
      // Qruplaşdırma tipini müəyyən et
      const groupBy = options?.groupBy || 'month';
      
      // Filtrləri hazırla
      const filterParams = {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        group_by: groupBy
      } as any;
      
      if (filters) {
        if (filters.categoryId) {
          filterParams.category_id = filters.categoryId;
        }
        
        if (filters.regionId) {
          filterParams.region_id = filters.regionId;
        }
        
        if (filters.sectorId) {
          filterParams.sector_id = filters.sectorId;
        }
        
        if (filters.schoolId) {
          filterParams.school_id = filters.schoolId;
        }
        
        if (filters.status) {
          filterParams.status = filters.status;
        }
      }
      
      // Məlumatları əldə et - SQL sorğusu istifadə edərək
      const { data, error } = await (supabase as any)
        .rpc('get_time_report', filterParams);
      
      if (error) {
        logger.error('Zaman hesabatı əldə etmə xətası:', error);
        return { data: null, error };
      }
      
      // Məlumatları qruplaşdır
      const timeMap = new Map();
      
      (data || []).forEach(item => {
        const date = new Date(item.created_at);
        let timeKey = '';
        
        // Qruplaşdırma tipinə görə açar yaratmaq
        switch (groupBy) {
          case 'year':
            timeKey = date.getFullYear().toString();
            break;
          case 'quarter':
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            timeKey = `${date.getFullYear()}-Q${quarter}`;
            break;
          case 'month':
          default:
            timeKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            break;
        }
        
        if (!timeMap.has(timeKey)) {
          timeMap.set(timeKey, {
            period: timeKey,
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
            draft: 0
          });
        }
        
        const periodData = timeMap.get(timeKey);
        periodData.total += 1;
        
        // Status üzrə sayları artır
        switch (item.status) {
          case 'approved':
            periodData.approved += 1;
            break;
          case 'pending':
            periodData.pending += 1;
            break;
          case 'rejected':
            periodData.rejected += 1;
            break;
          case 'draft':
            periodData.draft += 1;
            break;
        }
      });
      
      // Nəticəni sırala
      let result = Array.from(timeMap.values());
      
      // Sıralama
      if (options?.sortBy) {
        result.sort((a, b) => {
          const aValue = a[options.sortBy || 'period'];
          const bValue = b[options.sortBy || 'period'];
          
          if (options.sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      } else {
        // Default olaraq tarix üzrə sırala
        result.sort((a, b) => a.period.localeCompare(b.period));
      }
      
      // Limit tətbiq et
      if (options?.limit && options.limit > 0) {
        result = result.slice(0, options.limit);
      }
      
      return { data: result, error: null };
    } catch (error) {
      logger.error('Zaman hesabatı əldə etmə xətası:', error);
      return { data: null, error };
    }
  },
  
  /**
   * Status hesabatı
   */
  getStatusReport: async (
    filters?: ReportFilter,
    options?: ReportOptions
  ): Promise<ReportResponse> => {
    try {
      // Filtrləri hazırla
      const filterParams = {} as any;
      
      if (filters) {
        if (filters.categoryId) {
          filterParams.category_id = filters.categoryId;
        }
        
        if (filters.regionId) {
          filterParams.region_id = filters.regionId;
        }
        
        if (filters.sectorId) {
          filterParams.sector_id = filters.sectorId;
        }
        
        if (filters.schoolId) {
          filterParams.school_id = filters.schoolId;
        }
        
        if (filters.startDate) {
          filterParams.start_date = filters.startDate;
        }
        
        if (filters.endDate) {
          filterParams.end_date = filters.endDate;
        }
      }
      
      // Status üzrə məlumat sayını əldə et - SQL sorğusu istifadə edərək
      const { data: statusData, error: statusError } = await (supabase as any)
        .rpc('get_status_counts_with_filters', filterParams);
        
      if (statusError) {
        logger.error('Status hesabatı əldə etmə xətası:', statusError);
        return { data: null, error: statusError };
      }
      
      // Nəticəni formatla
      const result = (statusData || []).map(item => ({
        status: item.status,
        count: parseInt(item.count)
      }));
      
      // Sıralama
      if (options?.sortBy) {
        result.sort((a, b) => {
          const aValue = a[options.sortBy || 'status'];
          const bValue = b[options.sortBy || 'status'];
          
          if (options.sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }
      
      return { data: result, error: null };
    } catch (error) {
      logger.error('Status hesabatı əldə etmə xətası:', error);
      return { data: null, error };
    }
  },
  
  /**
   * İstifadəçi aktivliyi hesabatı
   */
  getUserActivityReport: async (
    days: number = 30
  ): Promise<ReportResponse> => {
    try {
      // Son N gün üçün tarix hesabla
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // İstifadəçi aktivliyini əldə et - SQL sorğusu istifadə edərək
      const { data: userData, error } = await (supabase as any)
        .rpc('get_user_activity', {
          start_date: startDate.toISOString()
        });
      
      if (error) {
        logger.error('İstifadəçi aktivliyi hesabatı əldə etmə xətası:', error);
        return { data: null, error };
      }
      
      // Nəticəni formatla
      const result = (userData || []).map(item => ({
        userId: item.created_by,
        firstName: item.users?.first_name || '',
        lastName: item.users?.last_name || '',
        email: item.users?.email || '',
        role: item.users?.role || '',
        count: parseInt(item.count)
      }));
      
      return { data: result, error: null };
    } catch (error) {
      logger.error('İstifadəçi aktivliyi hesabatı əldə etmə xətası:', error);
      return { data: null, error };
    }
  },
  
  /**
   * Kateqoriya tamamlanma hesabatı
   */
  getCategoryCompletionReport: async (): Promise<ReportResponse> => {
    try {
      // Bütün kateqoriyaları əldə et
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name');
      
      if (categoriesError) {
        logger.error('Kateqoriyaları əldə etmə xətası:', categoriesError);
        return { data: null, error: categoriesError };
      }
      
      // Bütün məktəbləri əldə et
      const { data: schools, error: schoolsError } = await supabase
        .from('schools')
        .select('id');
      
      if (schoolsError) {
        logger.error('Məktəbləri əldə etmə xətası:', schoolsError);
        return { data: null, error: schoolsError };
      }
      
      // Hər bir kateqoriya üçün tamamlanma faizini hesabla
      const result = await Promise.all((categories || []).map(async (category) => {
        // Kateqoriya üçün tamamlanmış məlumat sayını əldə et
        const { count: completedCount, error: completedError } = await supabase
          .from('data')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('status', 'approved');
        
        if (completedError) {
          logger.error('Tamamlanmış məlumat sayını əldə etmə xətası:', completedError);
          return {
            categoryId: category.id,
            categoryName: category.name,
            completionRate: 0,
            completedCount: 0,
            totalSchools: schools?.length || 0
          };
        }
        
        // Tamamlanma faizini hesabla
        const totalSchools = schools?.length || 0;
        const completionRate = totalSchools > 0 ? (completedCount || 0) / totalSchools * 100 : 0;
        
        return {
          categoryId: category.id,
          categoryName: category.name,
          completionRate: Math.round(completionRate * 100) / 100, // 2 onluq rəqəmə yuvarlaqlaşdır
          completedCount: completedCount || 0,
          totalSchools
        };
      }));
      
      // Tamamlanma faizinə görə azalan sıra ilə sırala
      result.sort((a, b) => b.completionRate - a.completionRate);
      
      return { data: result, error: null };
    } catch (error) {
      logger.error('Kateqoriya tamamlanma hesabatı əldə etmə xətası:', error);
      return { data: null, error };
    }
  }
};

export default reportService;
