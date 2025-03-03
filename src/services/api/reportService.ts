
import api from './index';

export interface ReportFilter {
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  groupBy?: 'region' | 'sector' | 'school' | 'category';
}

const reportService = {
  getDashboardData: async () => {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },
  
  getCompletionStats: async (filters: ReportFilter = {}) => {
    const response = await api.get('/reports/completion', { params: filters });
    return response.data;
  },
  
  getComparisonData: async (filters: ReportFilter = {}) => {
    const response = await api.get('/reports/comparison', { params: filters });
    return response.data;
  },
  
  exportReport: async (reportType: string, filters: ReportFilter = {}) => {
    const response = await api.get(`/reports/export/${reportType}`, {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }
};

export default reportService;
