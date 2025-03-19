/**
 * Kateqoriya xidməti - kateqoriyaların və sütunların idarə edilməsi üçün
 */
import { supabase, withRetry } from '@/lib/supabase';
import { Category, Column } from '@/types/supabase';
import { logger } from '@/utils/logger';

export type CategoryAssignment = 'All' | 'Regions' | 'Sectors' | 'Schools';
export type CategoryStatus = 'Active' | 'Inactive';

export interface CategoryFilter {
  search?: string;
  assignment?: CategoryAssignment;
  status?: CategoryStatus;
  deadlineBefore?: string;
  deadlineAfter?: string;
  minCompletionRate?: number;
  maxCompletionRate?: number;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  assignment: CategoryAssignment;
  priority: number;
  status: CategoryStatus;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  assignment?: CategoryAssignment;
  priority?: number;
  status?: CategoryStatus;
}

export interface CreateColumnDto {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  options?: string[];
}

export interface UpdateColumnDto {
  name?: string;
  type?: string;
  required?: boolean;
  description?: string;
  options?: string[];
  order?: number;
}

/**
 * Kateqoriya xidməti
 */
const categoryService = {
  /**
   * Kateqoriyaları əldə et
   */
  getCategories: async (filters?: CategoryFilter): Promise<Category[]> => {
    try {
      let query = supabase
        .from('categories')
        .select(`
          id,
          name,
          description,
          assignment,
          status,
          priority,
          created_at
        `);

      // Filtrləri tətbiq et
      if (filters) {
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
        if (filters.assignment) {
          query = query.eq('assignment', filters.assignment);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.deadlineBefore) {
          query = query.lte('created_at', filters.deadlineBefore);
        }
        if (filters.deadlineAfter) {
          query = query.gte('created_at', filters.deadlineAfter);
        }
        if (filters.minCompletionRate !== undefined) {
          query = query.gte('completion_rate', filters.minCompletionRate);
        }
        if (filters.maxCompletionRate !== undefined) {
          query = query.lte('completion_rate', filters.maxCompletionRate);
        }
      }

      // Həmişə prioritet üzrə sırala
      query = query.order('priority', { ascending: true });

      const { data, error } = await query;

      if (error) {
        logger.error('Kateqoriyaları əldə etmə xətası:', error);
        throw error;
      }

      // Heç bir məlumat qaytarılmadıqda, boş massiv qaytar
      if (!data || data.length === 0) {
        return [];
      }

      // Tamamlanma dərəcələrini hesabla (real tətbiqdə daha mürəkkəb olacaq)
      const categoriesWithCompletionRates = await Promise.all(
        data.map(async (item) => {
          const completionRate = await categoryService.calculateCategoryCompletionRate(item.id);
          const columnsCount = await categoryService.getCategoryColumnsCount(item.id);
          
          return {
            id: item.id,
            name: item.name,
            description: item.description || '',
            assignment: item.assignment as CategoryAssignment || 'All',
            columns: columnsCount,
            completionRate,
            status: item.status as CategoryStatus,
            priority: item.priority,
            created_at: item.created_at,
            updated_at: item.created_at, // Default updated_at to created_at
            createdAt: item.created_at
          };
        })
      );

      return categoriesWithCompletionRates as unknown as Category[];
    } catch (error) {
      logger.error('Kateqoriyaları əldə etmə xətası:', error);
      throw error;
    }
  },

  /**
   * Kateqoriyanı ID ilə əldə et
   */
  getCategoryById: async (id: string): Promise<Category | null> => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          description,
          assignment,
          status,
          priority,
          created_at
        `)
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Kateqoriya əldə etmə xətası:', error);
        return null;
      }

      // Bu kateqoriya üçün sütunları əldə et
      const columns = await categoryService.getCategoryColumns(id);
      const completionRate = await categoryService.calculateCategoryCompletionRate(id);

      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        assignment: data.assignment as CategoryAssignment,
        columns: columns.length,
        completionRate,
        status: data.status as CategoryStatus,
        priority: data.priority,
        created_at: data.created_at,
        updated_at: data.created_at, // Default updated_at to created_at
        createdAt: data.created_at
      } as unknown as Category;
    } catch (error) {
      logger.error('Kateqoriya əldə etmə xətası:', error);
      return null;
    }
  },

  /**
   * Yeni kateqoriya yarat
   */
  createCategory: async (category: CreateCategoryDto): Promise<Category | null> => {
    try {
      // Təyinat tipini doğrula
      const validAssignments = ['All', 'Regions', 'Sectors', 'Schools'];
      if (!validAssignments.includes(category.assignment as string)) {
        throw new Error(`Yanlış təyinat dəyəri. Bunlardan biri olmalıdır: ${validAssignments.join(', ')}`);
      }
      
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          description: category.description,
          assignment: category.assignment,
          priority: category.priority,
          status: category.status
        })
        .select()
        .single();

      if (error) {
        logger.error('Kateqoriya yaratma xətası:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        assignment: data.assignment as CategoryAssignment,
        columns: 0,
        completionRate: 0,
        status: data.status as CategoryStatus,
        priority: data.priority,
        created_at: data.created_at,
        updated_at: data.created_at, // Default updated_at to created_at
        createdAt: data.created_at
      } as unknown as Category;
    } catch (error) {
      logger.error('Kateqoriya yaratma xətası:', error);
      return null;
    }
  },

  /**
   * Kateqoriyanı yenilə
   */
  updateCategory: async (id: string, category: UpdateCategoryDto): Promise<Category | null> => {
    try {
      // Təyinat tipini doğrula
      if (category.assignment) {
        const validAssignments = ['All', 'Regions', 'Sectors', 'Schools'];
        if (!validAssignments.includes(category.assignment as string)) {
          throw new Error(`Yanlış təyinat dəyəri. Bunlardan biri olmalıdır: ${validAssignments.join(', ')}`);
        }
      }
      
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: category.name,
          description: category.description,
          assignment: category.assignment,
          priority: category.priority,
          status: category.status
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Kateqoriya yeniləmə xətası:', error);
        return null;
      }

      // Sütun sayını və tamamlanma dərəcəsini əldə et
      const columnsCount = await categoryService.getCategoryColumnsCount(id);
      const completionRate = await categoryService.calculateCategoryCompletionRate(id);

      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        assignment: data.assignment as CategoryAssignment || 'All',
        columns: columnsCount,
        completionRate,
        status: data.status as CategoryStatus,
        priority: data.priority,
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at,
        createdAt: data.created_at
      } as unknown as Category;
    } catch (error) {
      logger.error('Kateqoriya yeniləmə xətası:', error);
      return null;
    }
  },

  /**
   * Kateqoriyanı sil
   */
  deleteCategory: async (id: string): Promise<boolean> => {
    try {
      // Əvvəlcə bu kateqoriya ilə əlaqəli bütün sütunları sil
      const { error: columnsError } = await supabase
        .from('columns')
        .delete()
        .eq('category_id', id);

      if (columnsError) {
        logger.error('Sütunları silmə xətası:', columnsError);
        return false;
      }

      // Sonra kateqoriyanı sil
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Kateqoriya silmə xətası:', error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Kateqoriya silmə xətası:', error);
      return false;
    }
  },

  /**
   * Kateqoriya prioritetini yenilə
   */
  updateCategoryPriority: async (id: string, newPriority: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ priority: newPriority })
        .eq('id', id);

      if (error) {
        logger.error('Kateqoriya prioriteti yeniləmə xətası:', error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Kateqoriya prioriteti yeniləmə xətası:', error);
      return false;
    }
  },

  /**
   * Kateqoriya sütunlarını əldə et
   */
  getCategoryColumns: async (categoryId: string): Promise<Column[]> => {
    try {
      const { data, error } = await supabase
        .from('columns')
        .select('*')
        .eq('category_id', categoryId)
        .order('order', { ascending: true });

      if (error) {
        logger.error('Kateqoriya sütunlarını əldə etmə xətası:', error);
        return [];
      }

      return data as Column[];
    } catch (error) {
      logger.error('Kateqoriya sütunlarını əldə etmə xətası:', error);
      return [];
    }
  },

  /**
   * Kateqoriya sütunlarının sayını əldə et
   */
  getCategoryColumnsCount: async (categoryId: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('columns')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', categoryId);

      if (error) {
        logger.error('Kateqoriya sütunlarının sayını əldə etmə xətası:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      logger.error('Kateqoriya sütunlarının sayını əldə etmə xətası:', error);
      return 0;
    }
  },

  /**
   * Yeni sütun yarat
   */
  createColumn: async (categoryId: string, column: CreateColumnDto): Promise<Column | null> => {
    try {
      // Ən yüksək sıra dəyərini əldə et
      const { data: existingColumns, error: countError } = await supabase
        .from('columns')
        .select('order')
        .eq('category_id', categoryId)
        .order('order', { ascending: false })
        .limit(1);

      if (countError) {
        logger.error('Sütun sırası əldə etmə xətası:', countError);
        return null;
      }

      const nextOrder = existingColumns.length > 0 ? existingColumns[0].order + 1 : 1;

      const { data, error } = await supabase
        .from('columns')
        .insert({
          category_id: categoryId,
          name: column.name,
          type: column.type,
          required: column.required,
          description: column.description,
          options: column.options,
          order: nextOrder
        })
        .select()
        .single();

      if (error) {
        logger.error('Sütun yaratma xətası:', error);
        return null;
      }

      return data as Column;
    } catch (error) {
      logger.error('Sütun yaratma xətası:', error);
      return null;
    }
  },

  /**
   * Sütunu yenilə
   */
  updateColumn: async (id: string, column: UpdateColumnDto): Promise<Column | null> => {
    try {
      const { data, error } = await supabase
        .from('columns')
        .update({
          name: column.name,
          type: column.type,
          required: column.required,
          description: column.description,
          options: column.options,
          order: column.order
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Sütun yeniləmə xətası:', error);
        return null;
      }

      return data as Column;
    } catch (error) {
      logger.error('Sütun yeniləmə xətası:', error);
      return null;
    }
  },

  /**
   * Sütunu sil
   */
  deleteColumn: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('columns')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Sütun silmə xətası:', error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Sütun silmə xətası:', error);
      return false;
    }
  },

  /**
   * Sütunların sırasını yenilə
   */
  updateColumnsOrder: async (columns: { id: string; order: number }[]): Promise<boolean> => {
    try {
      // Supabase toplu yeniləmələri dəstəkləmir, hər sütunu ayrıca yeniləmək lazımdır
      for (const column of columns) {
        const { error } = await supabase
          .from('columns')
          .update({ order: column.order })
          .eq('id', column.id);

        if (error) {
          logger.error('Sütun sırası yeniləmə xətası:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      logger.error('Sütun sırası yeniləmə xətası:', error);
      return false;
    }
  },

  /**
   * Kateqoriya tamamlanma dərəcəsini hesabla
   */
  calculateCategoryCompletionRate: async (categoryId: string): Promise<number> => {
    try {
      // Bu, daha mürəkkəb bir hesablama üçün yer tutucudur
      // Real tətbiqdə, bu, məktəblərin bu kateqoriya üçün məlumat doldurmasına əsasən hesablanacaq
      
      // Hələlik, 20 və 95 arasında təsadüfi bir rəqəm qaytar
      return Math.floor(Math.random() * 75) + 20;
    } catch (error) {
      logger.error('Tamamlanma dərəcəsi hesablama xətası:', error);
      return 0;
    }
  },

  /**
   * Region tamamlanma məlumatlarını əldə et
   */
  getRegionCompletionData: async (categoryId: string): Promise<{ name: string; completion: number }[]> => {
    try {
      // Bütün regionları əldə et
      const { data: regions, error: regionsError } = await supabase
        .from('regions')
        .select('id, name');

      if (regionsError) {
        logger.error('Region məlumatları əldə etmə xətası:', regionsError);
        return [];
      }

      // Hər region üçün tamamlanma dərəcəsini hesabla (real tətbiqdə daha mürəkkəb sorğu olacaq)
      const completionData = regions.map(region => ({
        name: region.name,
        completion: Math.floor(Math.random() * 60) + 30 // 30-90% arasında təsadüfi dəyər
      }));

      // Tamamlanma dərəcəsinə görə azalan sırala
      return completionData.sort((a, b) => b.completion - a.completion);
    } catch (error) {
      logger.error('Region tamamlanma məlumatları əldə etmə xətası:', error);
      return [];
    }
  },

  /**
   * Kateqoriya şablonunu ixrac et
   */
  exportCategoryTemplate: async (categoryId: string): Promise<Blob> => {
    // Bu funksiya kateqoriya sütunlarına əsasən Excel şablonu yaradacaq
    // Hələlik, sadə bir yer tutucu qaytaracağıq
    try {
      logger.info(`${categoryId} ID-li kateqoriya üçün şablon ixrac edilir`);
      // Nümayiş üçün sadə bir mətn blob-u qaytar
      return new Blob(['Nümunə Excel Şablonu'], { type: 'text/plain' });
    } catch (error) {
      logger.error('Kateqoriya şablonu ixrac xətası:', error);
      throw error;
    }
  }
};

export default categoryService;
