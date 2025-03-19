
import { supabase } from '@/lib/supabase';
import { SectorWithStats } from '@/services/supabase/sector/types';

// Get all sectors for a region with stats
export const getSectorsByRegionId = async (regionId: string): Promise<SectorWithStats[]> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select('*, regions(name)')
      .eq('region_id', regionId)
      .order('name');
      
    if (error) {
      throw error;
    }
    
    // Get region name
    const { data: regionData } = await supabase
      .from('regions')
      .select('name')
      .eq('id', regionId)
      .single();
    
    // Get school counts and calculate completion rates for each sector
    const sectorsWithStats = await Promise.all((data || []).map(async (sector) => {
      // Get school count for this sector
      const { count: schoolCount } = await supabase
        .from('schools')
        .select('*', { count: 'exact', head: true })
        .eq('sector_id', sector.id);
      
      // In a real app, you would calculate the actual completion rate
      // For now, we'll use a random value
      const completionRate = Math.floor(Math.random() * 100);
      
      return {
        ...sector,
        regionName: regionData?.name || '',
        schoolCount: schoolCount || 0,
        completionRate,
        created_at: sector.created_at || new Date().toISOString(),
        updated_at: sector.updated_at || new Date().toISOString(),
      } as SectorWithStats;
    }));
    
    return sectorsWithStats;
  } catch (error) {
    console.error('Error fetching sectors by region ID:', error);
    return [];
  }
};

// Get a sector by ID with stats
export const getSectorById = async (id: string): Promise<SectorWithStats | null> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select('*, regions(name)')
      .eq('id', id)
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Get school count for this sector
    const { count: schoolCount } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true })
      .eq('sector_id', id);
    
    // In a real app, you would calculate the actual completion rate
    const completionRate = Math.floor(Math.random() * 100);
    
    return {
      ...data,
      regionName: data.regions?.name || '',
      schoolCount: schoolCount || 0,
      completionRate,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching sector by ID:', error);
    return null;
  }
};

// Create a new sector
export const createSector = async (name: string, regionId: string): Promise<SectorWithStats | null> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .insert({
        name,
        region_id: regionId
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    // Get region name
    const { data: regionData } = await supabase
      .from('regions')
      .select('name')
      .eq('id', regionId)
      .single();
    
    return {
      ...data,
      regionName: regionData?.name || '',
      schoolCount: 0,
      completionRate: 0,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating sector:', error);
    return null;
  }
};

// Update a sector
export const updateSector = async (id: string, name: string, regionId: string): Promise<SectorWithStats | null> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .update({
        name,
        region_id: regionId
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    // Get region name
    const { data: regionData } = await supabase
      .from('regions')
      .select('name')
      .eq('id', regionId)
      .single();
    
    // Get school count
    const { count: schoolCount } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true })
      .eq('sector_id', id);
    
    return {
      ...data,
      regionName: regionData?.name || '',
      schoolCount: schoolCount || 0,
      completionRate: Math.floor(Math.random() * 100),
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error updating sector:', error);
    return null;
  }
};

// Delete a sector
export const deleteSector = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sectors')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting sector:', error);
    return false;
  }
};
