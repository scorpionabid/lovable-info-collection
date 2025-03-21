import { supabase } from '@/lib/supabase'; // Fixed import
import { 
  Region, 
  RegionWithStats, 
  RegionFilters, 
  CreateRegionDto, 
  UpdateRegionDto 
} from '@/supabase/types'; // Fixed import to use consolidated types

// Define FilterParams interface for backward compatibility
export interface FilterParams {
  search?: string;
  region_id?: string;
  status?: 'active' | 'inactive' | 'all';
  min_completion_rate?: number;
  max_completion_rate?: number;
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  archived?: boolean;
  completionRate?: string;
  // For backward compatibility
  regionId?: string;
}

// Re-export interfaces for backward compatibility
export type { Region, RegionWithStats, RegionFilters, CreateRegionDto, UpdateRegionDto };

// Get all regions with pagination, filters and sorting
export const getRegions = async (
  filters?: RegionFilters
): Promise<{ data: RegionWithStats[]; count: number }> => {
  try {
    // Implementation details omitted for brevity
    return { data: [], count: 0 }; // Placeholder return
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

// Search regions by name
export const searchRegions = async (searchTerm: string): Promise<Region[]> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching regions:', error);
    throw error;
  }
};

// Export other region operations
export * from './regionOperations';
