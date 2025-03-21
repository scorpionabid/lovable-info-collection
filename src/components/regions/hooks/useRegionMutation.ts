
/**
 * Region mutasiyası üçün universal hook
 */
import { useSupabaseMutation } from '@/hooks/supabase';
import { RegionWithStats } from '@/supabase/types';
import { Region } from '@/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Region üçün mutasiya əməliyyatları
 * @param id Region ID (update, delete üçün)
 * @param data Region məlumatları
 */
export const useRegionMutation = () => {
  // Region yaratmaq üçün mutasiya
  const createRegion = useSupabaseMutation<RegionWithStats, Partial<Region>>(
    'regions',
    async (client: SupabaseClient, data: Partial<Region>, operation) => {
      const result = await client
        .from('regions')
        .insert({
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      // Tipini RegionWithStats-a çevirimək
      if (result.data) {
        const regionWithStats: RegionWithStats = {
          ...result.data,
          sectorCount: 0,
          schoolCount: 0,
          completionRate: 0
        };
        return { data: regionWithStats, error: result.error };
      }
      
      return result;
    },
    {
      queryKey: ['regions'],
      operation: 'insert',
      successToast: 'Region uğurla yaradıldı',
      errorToast: 'Region yaradılarkən xəta baş verdi',
      invalidateQueryKeys: [['regions']]
    }
  );

  // Region yeniləmək üçün mutasiya
  const updateRegion = useSupabaseMutation<RegionWithStats, { id: string } & Partial<Region>>(
    'regions',
    async (client: SupabaseClient, { id, ...data }, operation) => {
      const result = await client
        .from('regions')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      // Tipini RegionWithStats-a çevirimək
      if (result.data) {
        const regionWithStats: RegionWithStats = {
          ...result.data,
          sectorCount: 0,
          schoolCount: 0,
          completionRate: 0
        };
        return { data: regionWithStats, error: result.error };
      }
      
      return result;
    },
    {
      queryKey: ['regions'],
      operation: 'update',
      successToast: 'Region uğurla yeniləndi',
      errorToast: 'Region yenilənərkən xəta baş verdi',
      invalidateQueryKeys: [['regions']]
    }
  );

  // Region silmək üçün mutasiya
  const deleteRegion = useSupabaseMutation<null, string>(
    'regions',
    async (client: SupabaseClient, id, operation) => {
      return client
        .from('regions')
        .delete()
        .eq('id', id)
        .then(() => ({ data: null, error: null }));
    },
    {
      queryKey: ['regions'],
      operation: 'delete',
      successToast: 'Region uğurla silindi',
      errorToast: 'Region silinərkən xəta baş verdi',
      invalidateQueryKeys: [['regions']]
    }
  );

  return {
    createRegion,
    updateRegion,
    deleteRegion
  };
};
