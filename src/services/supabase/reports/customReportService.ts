
import { supabase } from '@/integrations/supabase/client';
import { CustomReportDefinition } from '../reports/types';

// Get all custom reports
export const getCustomReports = async () => {
  try {
    // For TypeScript, we need to cast the table name since it might not be in the types
    // In a real implementation, you would add this table to your Database type
    const { data, error } = await supabase
      .from('templates' as any)
      .select('*')
      .eq('type', 'report')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!data) return { data: [], error: null };
    
    // Map the data to the CustomReportDefinition interface
    const reports: CustomReportDefinition[] = data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      reportType: item.content.report_type || 'custom',
      parameters: item.content.parameters || {},
      visualType: item.content.visual_type || 'table',
      createdBy: item.created_by,
      createdAt: item.created_at
    }));
    
    return { data: reports, error: null };
  } catch (error) {
    console.error('Error fetching custom reports:', error);
    return { data: [], error };
  }
};

// Get a single custom report by ID
export const getCustomReportById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('templates' as any)
      .select('*')
      .eq('id', id)
      .eq('type', 'report')
      .single();
    
    if (error) throw error;
    
    if (!data) return { data: null, error: new Error('Report not found') };
    
    // Map to CustomReportDefinition
    const report: CustomReportDefinition = {
      id: data.id,
      name: data.name,
      description: data.description,
      reportType: data.content.report_type || 'custom',
      parameters: data.content.parameters || {},
      visualType: data.content.visual_type || 'table',
      createdBy: data.created_by,
      createdAt: data.created_at
    };
    
    return { data: report, error: null };
  } catch (error) {
    console.error('Error fetching custom report by ID:', error);
    return { data: null, error };
  }
};

// Create a new custom report
export const createCustomReport = async (report: Omit<CustomReportDefinition, 'id' | 'createdAt'>, userId: string) => {
  try {
    // Convert to the template format
    const templateData = {
      name: report.name,
      description: report.description || '',
      type: 'report',
      content: {
        report_type: report.reportType,
        parameters: report.parameters,
        visual_type: report.visualType
      },
      is_public: true,
      created_by: userId
    };
    
    const { data, error } = await supabase
      .from('templates' as any)
      .insert(templateData)
      .select();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating custom report:', error);
    return { data: null, error };
  }
};

// Update a custom report
export const updateCustomReport = async (id: string, updates: Partial<CustomReportDefinition>) => {
  try {
    // Convert to the template format
    const templateUpdates: any = {};
    
    if (updates.name) templateUpdates.name = updates.name;
    if (updates.description) templateUpdates.description = updates.description;
    
    if (updates.reportType || updates.parameters || updates.visualType) {
      // Get current content first
      const { data: currentData } = await supabase
        .from('templates' as any)
        .select('content')
        .eq('id', id)
        .single();
      
      const content = currentData?.content || {};
      
      if (updates.reportType) content.report_type = updates.reportType;
      if (updates.parameters) content.parameters = updates.parameters;
      if (updates.visualType) content.visual_type = updates.visualType;
      
      templateUpdates.content = content;
    }
    
    const { data, error } = await supabase
      .from('templates' as any)
      .update(templateUpdates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating custom report:', error);
    return { data: null, error };
  }
};

// Delete a custom report
export const deleteCustomReport = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('templates' as any)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting custom report:', error);
    return { success: false, error };
  }
};

export default {
  getCustomReports,
  getCustomReportById,
  createCustomReport,
  updateCustomReport,
  deleteCustomReport
};
