
import { supabase } from '@/integrations/supabase/client';
import { CustomReportDefinition } from './types';

// Get all custom reports
export const getCustomReports = async (): Promise<CustomReportDefinition[]> => {
  try {
    // Mock custom reports
    return [
      {
        id: '1',
        name: 'İllik Hesabat',
        description: 'İlin ümumi doldurulma hesabatı',
        report_type: 'completion',
        parameters: { period: 'yearly' },
        visual_type: 'bar',
        created_by: 'admin',
        created_at: '2023-01-15T08:00:00Z'
      },
      {
        id: '2',
        name: 'Region Müqayisəsi',
        description: 'Regionların performans müqayisəsi',
        report_type: 'comparison',
        parameters: { type: 'region' },
        visual_type: 'bar',
        created_by: 'admin',
        created_at: '2023-02-20T10:30:00Z'
      }
    ];
  } catch (error) {
    console.error('Error fetching custom reports:', error);
    return [];
  }
};

// Get a custom report by ID
export const getCustomReportById = async (id: string): Promise<CustomReportDefinition | null> => {
  try {
    const reports = await getCustomReports();
    return reports.find(report => report.id === id) || null;
  } catch (error) {
    console.error('Error fetching custom report:', error);
    return null;
  }
};

// Create a new custom report
export const createCustomReport = async (report: Omit<CustomReportDefinition, 'id' | 'created_at'>): Promise<CustomReportDefinition | null> => {
  try {
    // Simulate creating a report
    const newReport = {
      id: Math.random().toString(36).substring(2, 11),
      name: report.name,
      description: report.description,
      report_type: report.report_type,
      parameters: report.parameters,
      visual_type: report.visual_type,
      created_by: report.created_by,
      created_at: new Date().toISOString()
    };
    
    return newReport;
  } catch (error) {
    console.error('Error creating custom report:', error);
    return null;
  }
};

// Get data for a custom report
export const getCustomReportData = async (reportId: string, params: any = {}): Promise<any[]> => {
  try {
    const report = await getCustomReportById(reportId);
    
    if (!report) {
      throw new Error('Report not found');
    }
    
    // Generate mock data based on report type
    if (report.report_type === 'completion') {
      return Array.from({ length: 10 }, (_, i) => ({
        name: `Item ${i + 1}`,
        value: Math.floor(Math.random() * 50) + 50,
        category: params.category || 'All'
      }));
    } else if (report.report_type === 'comparison') {
      return Array.from({ length: 8 }, (_, i) => ({
        name: `Region ${i + 1}`,
        value: Math.floor(Math.random() * 40) + 60,
        previousValue: Math.floor(Math.random() * 35) + 55,
        change: Math.floor(Math.random() * 20) - 10
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error generating custom report data:', error);
    return [];
  }
};
