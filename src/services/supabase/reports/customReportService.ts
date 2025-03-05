
import { supabase } from '../supabaseClient';
import { fileExport } from '@/utils/fileExport';
import { CustomReportDefinition } from './types';
import { getRegionCompletionStats } from './completionStatsService';
import { getRegionPerformanceRanking } from './performanceService';
import { getRegionSectorPerformance } from './performanceService';
import { getQuarterlyTrends } from './trendsService';

// Custom Reports
export const saveCustomReport = async (reportDefinition: CustomReportDefinition): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('custom_reports')
      .insert({
        name: reportDefinition.name,
        description: reportDefinition.description,
        report_type: reportDefinition.reportType,
        parameters: reportDefinition.parameters,
        visual_type: reportDefinition.visualType,
        created_by: supabase.auth.getUser() ? (await supabase.auth.getUser()).data.user?.id : null
      })
      .select('id')
      .single();
    
    if (error) throw error;
    
    return data.id;
  } catch (error) {
    console.error('Error saving custom report:', error);
    throw error;
  }
};

export const getCustomReports = async (): Promise<CustomReportDefinition[]> => {
  try {
    const { data, error } = await supabase
      .from('custom_reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Map the database fields to our interface
    return data.map(report => ({
      id: report.id,
      name: report.name,
      description: report.description,
      reportType: report.report_type,
      parameters: report.parameters,
      visualType: report.visual_type,
      createdBy: report.created_by,
      createdAt: report.created_at
    }));
  } catch (error) {
    console.error('Error fetching custom reports:', error);
    throw error;
  }
};

// Generate a custom report based on a category
export const generateCustomReport = async (categoryId: string): Promise<any> => {
  try {
    // First, check if the category exists
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id, name, assignment')
      .eq('id', categoryId)
      .single();
    
    if (categoryError) {
      console.error('Error fetching category details:', categoryError);
      throw new Error(`Kateqoriya tapılmadı: ${categoryError.message}`);
    }

    // Generate report data based on the category
    let result = {
      reportName: categoryData.name,
      generatedAt: new Date().toISOString(),
      categoryId: categoryId,
      categoryName: categoryData.name,
      assignment: categoryData.assignment,
      data: [] as any[]
    };
    
    // Generate some sample data based on the category assignment type
    if (categoryData.assignment === 'All') {
      result.data = await getRegionCompletionStats();
    } else if (categoryData.assignment === 'Regions') {
      result.data = await getRegionPerformanceRanking();
    } else if (categoryData.assignment === 'Sectors') {
      const sectorsData = await getRegionSectorPerformance();
      result.data = sectorsData.map(item => ({
        name: `${item.region} - ${item.sector}`,
        value: item.performance
      }));
    } else {
      // For other assignment types, use quarterly trends
      result.data = await getQuarterlyTrends();
    }
    
    return result;
  } catch (error) {
    console.error('Error generating custom report:', error);
    throw error;
  }
};

// Export Functions
export const exportReportData = async (
  data: any[], 
  fileName: string, 
  fileType: 'xlsx' | 'csv' | 'pdf'
): Promise<boolean> => {
  try {
    return await fileExport({
      data,
      fileName,
      fileType
    });
  } catch (error) {
    console.error(`Error exporting report as ${fileType}:`, error);
    throw error;
  }
};
