
import { supabase } from '@/lib/supabase';
import { RegionWithStats } from '@/services/supabase/region/types';

// Get a region by ID with stats
export const getRegionById = async (id: string): Promise<RegionWithStats | null> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching region:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    // Get sectors count
    const { count: sectorCount } = await supabase
      .from('sectors')
      .select('*', { count: 'exact', head: true })
      .eq('region_id', id);
    
    // Get schools count
    const { count: schoolCount } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true })
      .eq('region_id', id);
    
    // You would normally calculate these from actual data
    const studentCount = 0;
    const teacherCount = 0;
    const completionRate = 0;
    
    return {
      ...data,
      sectorCount: sectorCount || 0,
      schoolCount: schoolCount || 0,
      studentCount,
      teacherCount,
      completionRate
    };
  } catch (error) {
    console.error('Error in getRegionById:', error);
    return null;
  }
};

// Get all regions with stats
export const getRegions = async (): Promise<RegionWithStats[]> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .order('name');
      
    if (error) {
      throw error;
    }
    
    // This is a simplified implementation
    // In a real app, you would calculate actual stats for each region
    const regionsWithStats = (data || []).map(region => ({
      ...region,
      sectorCount: 0,
      schoolCount: 0,
      studentCount: 0,
      teacherCount: 0,
      completionRate: 0
    }));
    
    return regionsWithStats;
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
};

// Create a new region
export const createRegion = async (name: string): Promise<RegionWithStats | null> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .insert({ name })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return {
      ...data,
      sectorCount: 0,
      schoolCount: 0,
      studentCount: 0,
      teacherCount: 0,
      completionRate: 0
    };
  } catch (error) {
    console.error('Error creating region:', error);
    return null;
  }
};

// Update a region
export const updateRegion = async (id: string, name: string): Promise<RegionWithStats | null> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      ...data,
      sectorCount: 0,
      schoolCount: 0,
      studentCount: 0,
      teacherCount: 0,
      completionRate: 0
    };
  } catch (error) {
    console.error('Error updating region:', error);
    return null;
  }
};

// Delete a region
export const deleteRegion = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('regions')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting region:', error);
    return false;
  }
};
