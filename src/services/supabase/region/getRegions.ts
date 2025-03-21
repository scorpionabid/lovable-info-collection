
import { supabase } from "../supabaseClient";
import { Region, RegionWithStats, FilterParams } from "./types";

export interface SortParams {
  column: string;
  direction: 'asc' | 'desc';
}

/**
 * Get all regions with optional filtering and sorting
 */
export const getRegions = async (
  filters?: FilterParams, 
  sort?: SortParams, 
  page?: number, 
  pageSize?: number
): Promise<RegionWithStats[]> => {
  try {
    let query = supabase.from('regions').select(`
      *,
      sectors:sectors(id),
      schools:schools(id)
    `);

    // Apply filters if provided
    if (filters) {
      // Optional filters from the FilterParams interface
      const { name, code, status, searchQuery, dateFrom, dateTo, completionRate } = filters;

      if (name) {
        query = query.ilike('name', `%${name}%`);
      }
      
      if (code) {
        query = query.eq('code', code);
      }
      
      if (status === 'archived') {
        query = query.eq('archived', true);
      } else if (status === 'active') {
        query = query.is('archived', null).or('archived.eq.false');
      }
      
      // Handle search query
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      // Handle date range if available
      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }
      
      if (dateTo) {
        query = query.lte('created_at', dateTo);
      }
    }

    // Apply sorting if provided
    if (sort) {
      query = query.order(sort.column, { ascending: sort.direction === 'asc' });
    } else {
      query = query.order('name');
    }

    // Apply pagination if both page and pageSize are provided
    if (page !== undefined && pageSize !== undefined) {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform the data to include counts and statistics
    const regions = (data || []).map((region) => {
      const sectorCount = region.sectors ? region.sectors.length : 0;
      const schoolCount = region.schools ? region.schools.length : 0;
      
      // Calculate a completion rate (placeholder for now)
      const completionRate = Math.floor(Math.random() * 40) + 60; // 60-100% random
      
      return {
        ...region,
        sectors_count: sectorCount,
        schools_count: schoolCount,
        completion_rate: completionRate,
        // Add UI fields for backward compatibility
        sectorCount: sectorCount,
        schoolCount: schoolCount,
        completionRate: completionRate,
        userCount: Math.floor(Math.random() * 20) + 5, // 5-25 random users
        // Add the new required fields with default values
        description: region.description || '',
        studentCount: 0,
        teacherCount: 0
      } as RegionWithStats;
    });

    return regions;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};
