
import { supabase } from '../supabaseClient';

// Helper function to get the count of columns for a category
export const getCategoryColumnsCount = async (categoryId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('columns')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', categoryId);
    
    if (error) {
      console.error('Error fetching column count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getCategoryColumnsCount:', error);
    return 0;
  }
};

// Helper function to calculate completion rate
export const calculateCategoryCompletionRate = async (categoryId: string): Promise<number> => {
  try {
    // Get total data entries for the category
    const { count: totalEntries, error: totalError } = await supabase
      .from('data')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', categoryId);
    
    if (totalError) {
      console.error('Error fetching total entries:', totalError);
      return 0;
    }
    
    // Get completed data entries
    const { count: completedEntries, error: completedError } = await supabase
      .from('data')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', categoryId)
      .eq('status', 'completed');
    
    if (completedError) {
      console.error('Error fetching completed entries:', completedError);
      return 0;
    }
    
    // Calculate completion rate
    if (totalEntries && totalEntries > 0) {
      return Math.round((completedEntries || 0) * 100 / totalEntries);
    }
    
    return 0;
  } catch (error) {
    console.error('Error in calculateCategoryCompletionRate:', error);
    return 0;
  }
};

// Function to retry a query with exponential backoff
export const retryQuery = async <T>(
  queryFn: () => Promise<T>, 
  maxRetries = 3, 
  initialDelay = 300
): Promise<T> => {
  let lastError: any;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      return await queryFn();
    } catch (error) {
      lastError = error;
      retryCount++;
      
      if (retryCount < maxRetries) {
        // Exponential backoff with jitter
        const delay = initialDelay * Math.pow(2, retryCount) * (0.5 + Math.random() * 0.5);
        await new Promise(resolve => setTimeout(resolve, delay));
        console.log(`Retrying query (attempt ${retryCount + 1}/${maxRetries})...`);
      }
    }
  }
  
  throw lastError;
};
