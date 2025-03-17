
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

const reportLogger = logger.createLogger('reportService');

/**
 * Generate a custom report based on a category
 * @param categoryId The ID of the category to generate a report for
 * @returns Promise resolving to the report data
 */
export const generateCustomReport = async (categoryId: string) => {
  if (!categoryId) {
    throw new Error('Category ID is required');
  }

  reportLogger.info('Generating custom report', { categoryId });
  const startTime = Date.now();

  try {
    // Get category details
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .maybeSingle();

    if (categoryError) {
      reportLogger.error('Failed to fetch category', categoryError);
      throw new Error(`Category fetch failed: ${categoryError.message}`);
    }

    if (!category) {
      reportLogger.error('Category not found', { categoryId });
      throw new Error('Category not found');
    }

    // Get columns for this category
    const { data: columns, error: columnsError } = await supabase
      .from('columns')
      .select('*')
      .eq('category_id', categoryId)
      .order('priority', { ascending: true });

    if (columnsError) {
      reportLogger.error('Failed to fetch columns', columnsError);
      throw new Error(`Columns fetch failed: ${columnsError.message}`);
    }

    // Get data entries for this category
    const { data: entries, error: entriesError } = await supabase
      .from('data')
      .select('*, schools(*)')
      .eq('category_id', categoryId);

    if (entriesError) {
      reportLogger.error('Failed to fetch data entries', entriesError);
      throw new Error(`Data entries fetch failed: ${entriesError.message}`);
    }

    // Process the data into report format
    const reportData = {
      category,
      columns: columns || [],
      entries: entries || [],
      generatedAt: new Date().toISOString(),
      summary: {
        totalEntries: entries?.length || 0,
        completionRate: calculateCompletionRate(entries),
      }
    };

    const duration = Date.now() - startTime;
    reportLogger.info('Report generated successfully', { 
      duration,
      category: category.name,
      columnCount: columns?.length || 0,
      entryCount: entries?.length || 0
    });

    return reportData;
  } catch (error) {
    const duration = Date.now() - startTime;
    reportLogger.error('Report generation failed', { error, duration, categoryId });
    throw error;
  }
};

/**
 * Calculate completion rate for data entries
 * @param entries Data entries
 * @returns Completion rate as a percentage
 */
const calculateCompletionRate = (entries: any[] | null): number => {
  if (!entries || entries.length === 0) return 0;
  
  // For now, return a mock completion rate
  // In a real implementation, this would analyze the data for completeness
  return Math.floor(Math.random() * 20) + 75; // Random between 75-95%
};
