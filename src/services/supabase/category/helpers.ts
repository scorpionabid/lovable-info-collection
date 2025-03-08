
import { supabase } from '../supabaseClient';

// Helper functions
export const calculateCategoryCompletionRate = async (categoryId: string): Promise<number> => {
  try {
    // This is a placeholder for a more complex calculation involving data entries
    // In a real app, you would calculate this based on how many schools have filled out data for this category
    
    // For now, returning a random number between 20 and 95
    return Math.floor(Math.random() * 75) + 20;
  } catch (error) {
    console.error('Error calculating completion rate:', error);
    return 0;
  }
};

export const getCategoryColumnsCount = async (categoryId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('columns')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', categoryId);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Error counting category columns:', error);
    return 0;
  }
};

export const getRegionCompletionData = async (categoryId: string): Promise<{ name: string; completion: number }[]> => {
  try {
    // Get all regions
    const { data: regions, error: regionsError } = await supabase
      .from('regions')
      .select('id, name');

    if (regionsError) throw regionsError;

    // Calculate completion rate for each region (this would be a more complex query in a real app)
    const completionData = regions.map(region => ({
      name: region.name,
      completion: Math.floor(Math.random() * 60) + 30 // Random value between 30-90%
    }));

    // Sort by completion rate descending
    return completionData.sort((a, b) => b.completion - a.completion);
  } catch (error) {
    console.error('Error getting region completion data:', error);
    return [];
  }
};

export const exportCategoryTemplate = async (categoryId: string): Promise<Blob> => {
  // This function would generate an Excel template based on category columns
  // For now, we'll just return a simple placeholder
  try {
    console.log(`Exporting template for category ${categoryId}`);
    // Return a simple text blob for demonstration
    return new Blob(['Sample Excel Template'], { type: 'text/plain' });
  } catch (error) {
    console.error('Error exporting category template:', error);
    throw error;
  }
};
