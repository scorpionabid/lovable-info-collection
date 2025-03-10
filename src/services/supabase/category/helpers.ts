
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

// Function to export category template as Excel file
export const exportCategoryTemplate = async (categoryId: string): Promise<Blob> => {
  try {
    // Get category columns
    const { data: columns, error: columnsError } = await supabase
      .from('columns')
      .select('*')
      .eq('category_id', categoryId)
      .order('order', { ascending: true });

    if (columnsError) throw columnsError;

    // Get category details
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('name')
      .eq('id', categoryId)
      .single();

    if (categoryError) throw categoryError;

    // Create template data - in a real implementation, you would use xlsx or similar library
    // This is a simple placeholder that creates a CSV format
    const headers = columns.map(col => col.name).join(',');
    const csvContent = `${headers}\n`;
    
    // Convert string to blob
    const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    return blob;
  } catch (error) {
    console.error('Error exporting category template:', error);
    throw error;
  }
};
