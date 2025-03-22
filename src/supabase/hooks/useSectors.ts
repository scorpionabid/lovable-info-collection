
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
import { Sector, SectorFilter } from '@/lib/supabase/types/sector';

export const useSectors = (filters: SectorFilter = {}) => {
  const [loading, setLoading] = useState(true);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const fetchSectors = async () => {
    try {
      let query = supabase.from('sectors').select(`
        id,
        name,
        region_id,
        description,
        created_at,
        updated_at,
        archived,
        regions:regions (id, name)
      `);

      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters.region_id || filters.regionId) {
        query = query.eq('region_id', filters.region_id || filters.regionId);
      }

      if (filters.status === 'archived') {
        query = query.eq('archived', true);
      } else if (filters.status === 'active' || !filters.status) {
        query = query.eq('archived', false);
      }

      if ('archived' in filters) {
        query = query.eq('archived', filters.archived);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return data as Sector[];
    } catch (error) {
      console.error('Error fetching sectors:', error);
      throw error;
    }
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['sectors', filters],
    queryFn: fetchSectors
  });

  useEffect(() => {
    if (data) {
      setSectors(data);
    }
    setLoading(isLoading);
    setError(isError ? new Error('Failed to fetch sectors') : null);
  }, [data, isLoading, isError]);

  return {
    sectors,
    loading,
    error,
    refetch,
  };
};

export default useSectors;
