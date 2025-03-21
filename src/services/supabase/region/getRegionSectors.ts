import { supabase } from '../supabaseClient';
import { Sector } from '../sector/types';

// Get sectors by region ID
export const getRegionSectors = async (regionId: string) => {
  try {
    // First, fetch all sectors in this region
    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .eq('region_id', regionId);
    
    if (error) throw error;

    // Get school counts for each sector
    const sectorIds = data.map(sector => sector.id);
    
    let schoolCounts = [];
    if (sectorIds.length > 0) {
      // Instead of using group(), we'll use a different approach
      // that's supported by the Supabase PostgrestFilterBuilder
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('sector_id, id')
        .in('sector_id', sectorIds);
      
      if (schoolsError) throw schoolsError;
      
      // Manually count schools per sector
      const countMap = new Map();
      schoolsData.forEach(school => {
        const currentCount = countMap.get(school.sector_id) || 0;
        countMap.set(school.sector_id, currentCount + 1);
      });
      
      // Format the counts like the original function expected
      schoolCounts = Array.from(countMap.entries()).map(([sector_id, count]) => ({
        sector_id,
        count
      }));
    }
    
    // Map school counts to sectors and add mock completion rates for now
    const sectorsWithStats = data.map(sector => {
      const schoolCountRecord = schoolCounts.find(s => s.sector_id === sector.id);
      // Generate a random completion rate between 60 and 95% for demo purposes
      const completionRate = Math.floor(Math.random() * 35) + 60;
      
      return {
        ...sector,
        schoolCount: schoolCountRecord?.count || 0,
        completionRate
      };
    });

    return sectorsWithStats;
  } catch (error) {
    console.error('Error fetching region sectors:', error);
    throw error;
  }
};
