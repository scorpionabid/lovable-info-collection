
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

// Enhanced function to retry a query with exponential backoff and better error handling
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
    } catch (error: any) {
      lastError = error;
      retryCount++;
      
      // Log detailed error information
      console.error(`Query attempt ${retryCount} failed:`, {
        error: error,
        message: error.message || 'Unknown error',
        details: error.details || '',
        hint: error.hint || '',
        code: error.code || ''
      });
      
      // Check for permission errors related to RLS
      if (error.code === '42501' || error.message?.includes('permission denied')) {
        console.error('Permission denied - likely an RLS policy issue');
        throw new Error('İcazə verilmədi. Zəhmət olmasa sistem administratoru ilə əlaqə saxlayın.');
      }
      
      // Check for network errors
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('network')) {
        if (retryCount >= maxRetries) {
          throw new Error('Şəbəkə xətası. Zəhmət olmasa internet bağlantınızı yoxlayın və yenidən cəhd edin.');
        }
      }
      
      if (retryCount < maxRetries) {
        // Exponential backoff with jitter
        const delay = initialDelay * Math.pow(2, retryCount) * (0.5 + Math.random() * 0.5);
        await new Promise(resolve => setTimeout(resolve, delay));
        console.log(`Retrying query (attempt ${retryCount + 1}/${maxRetries})...`);
      }
    }
  }
  
  // Create a more informative error message
  const errorMessage = lastError?.message || 'Bilinməyən xəta';
  const detailedError = lastError?.details ? `: ${lastError.details}` : '';
  throw new Error(`Əməliyyat uğursuz oldu: ${errorMessage}${detailedError}`);
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

// New function to perform operations within a transaction
export const withTransaction = async <T>(
  operations: (client: typeof supabase) => Promise<T>
): Promise<T> => {
  // Start a transaction
  const { error: beginError } = await supabase.rpc('begin_transaction');
  if (beginError) {
    console.error('Error starting transaction:', beginError);
    throw new Error('Tranzaksiya başlada bilmədi: ' + (beginError.message || 'Bilinməyən xəta'));
  }
  
  try {
    // Execute the operations
    const result = await operations(supabase);
    
    // Commit the transaction
    const { error: commitError } = await supabase.rpc('commit_transaction');
    if (commitError) {
      console.error('Error committing transaction:', commitError);
      // Try to rollback
      await supabase.rpc('rollback_transaction').catch(e => 
        console.error('Failed to rollback after commit error:', e)
      );
      throw new Error('Tranzaksiya tamamlana bilmədi: ' + (commitError.message || 'Bilinməyən xəta'));
    }
    
    return result;
  } catch (error: any) {
    // Rollback the transaction on error
    const { error: rollbackError } = await supabase.rpc('rollback_transaction');
    if (rollbackError) {
      console.error('Error rolling back transaction:', rollbackError);
    }
    
    console.error('Transaction failed:', error);
    throw new Error('Əməliyyat uğursuz oldu: ' + (error.message || 'Bilinməyən xəta'));
  }
};

// Improved version of validation functions for category data
export const validateCategoryData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check for required fields
  if (!data.name || data.name.trim() === '') {
    errors.push('Kateqoriya adı tələb olunur');
  }
  
  // Validate assignment
  const validAssignments = ['All', 'Regions', 'Sectors', 'Schools'];
  if (!data.assignment || !validAssignments.includes(data.assignment)) {
    errors.push(`Təyinat dəyəri düzgün deyil. Dəyər bunlardan biri olmalıdır: ${validAssignments.join(', ')}`);
  }
  
  // Validate priority
  if (data.priority === undefined || data.priority < 1) {
    errors.push('Prioritet 1-dən böyük və ya bərabər olmalıdır');
  }
  
  // Validate status
  const validStatuses = ['Active', 'Inactive'];
  if (!data.status || !validStatuses.includes(data.status)) {
    errors.push(`Status dəyəri düzgün deyil. Dəyər bunlardan biri olmalıdır: ${validStatuses.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
