
import { supabase } from './supabaseClient';
import { ReportParams, ExportConfig } from './reports/types';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import the actual report services
import * as completionStatsService from './reports/completionStatsService';
import * as trendsService from './reports/trendsService';
import * as performanceService from './reports/performanceService';
import * as customReportService from './reports/customReportService';

// Implement missing functions
export const getRegionCompletionStats = (params?: any) => {
  return completionStatsService.getRegionCompletionData('all', params);
};

export const getCategoryCompletionStats = (params?: any) => {
  return completionStatsService.getCategoryCompletionData('all', params);
};

export const getTimelineCompletionStats = (params?: any) => {
  return completionStatsService.getTimelineData(params);
};

export const getSubmissionStatusStats = (params?: any) => {
  return completionStatsService.getSubmissionStatusData(params);
};

export const getRegionPerformanceRanking = (params?: any) => {
  return performanceService.getRegionPerformanceData(params);
};

export const getPerformanceTrend = (params?: any) => {
  return performanceService.getPerformanceTrendData(params);
};

export const getRegionSectorPerformance = (params?: any) => {
  return performanceService.getRegionSectorData(params);
};

// Re-export all functions from the report services
export const {
  getCompletionData,
  getCriticalAreas,
  getOnTimeSubmissionRate
} = completionStatsService;

export const {
  getCategoryTrends,
  getRegionComparison,
  getQuarterlyTrends,
  getDistributionData,
  getYearlyComparison
} = trendsService;

export const {
  getPerformanceMetrics
} = performanceService;

export const {
  getCustomReports,
  getCustomReportById,
  createCustomReport
} = customReportService;

export const generateCustomReport = (reportId: string, params: any = {}) => {
  return customReportService.getCustomReportData(reportId, params);
};

// Add missing export function for report data
export const exportReportData = async (
  data: any[],
  filename: string,
  format: 'xlsx' | 'pdf' | 'csv'
): Promise<boolean> => {
  try {
    switch (format) {
      case 'xlsx':
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), `${filename}.xlsx`);
        break;
      
      case 'csv':
        const csvContent = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(data));
        saveAs(new Blob([csvContent], { type: 'text/csv;charset=utf-8' }), `${filename}.csv`);
        break;
      
      case 'pdf':
        const doc = new jsPDF();
        
        if (data.length > 0) {
          const headers = Object.keys(data[0]);
          const rows = data.map(obj => headers.map(header => obj[header]));
          
          autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 20,
          });
          
          doc.text(`${filename}`, 14, 15);
        } else {
          doc.text('No data to export', 14, 20);
        }
        
        doc.save(`${filename}.pdf`);
        break;
    }
    
    return true;
  } catch (error) {
    console.error('Error exporting report data:', error);
    return false;
  }
};
