/**
 * İxrac xidməti - məlumatların müxtəlif formatlarda ixracı üçün
 */
import { supabase } from '@/lib/supabase';
import { Data, Column } from '@/types/supabase';
import { logger } from '@/utils/logger';

export interface ExportOptions {
  format: 'xlsx' | 'csv' | 'pdf' | 'json';
  includeMetadata?: boolean;
  includeHistory?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: {
    categoryId?: string;
    schoolId?: string;
    regionId?: string;
    sectorId?: string;
    status?: string;
  };
}

/**
 * İxrac xidməti
 */
const exportService = {
  /**
   * Kateqoriya məlumatlarını ixrac et
   */
  exportCategoryData: async (categoryId: string, options: ExportOptions): Promise<Blob | null> => {
    try {
      // Kateqoriya məlumatlarını əldə et
      let query = supabase
        .from('data')
        .select(`
          *,
          schools:schools(id, name),
          categories:categories(id, name, description),
          created_by_user:users!created_by(id, first_name, last_name),
          approved_by_user:users!approved_by(id, first_name, last_name)
        `)
        .eq('category_id', categoryId);
      
      // Əlavə filtrləri tətbiq et
      if (options.filters) {
        if (options.filters.schoolId) {
          query = query.eq('school_id', options.filters.schoolId);
        }
        if (options.filters.status) {
          query = query.eq('status', options.filters.status);
        }
      }
      
      // Tarix aralığı filtrini tətbiq et
      if (options.dateRange) {
        query = query.gte('created_at', options.dateRange.start)
          .lte('created_at', options.dateRange.end);
      }
      
      const { data, error } = await query;
      
      if (error) {
        logger.error('Məlumatları ixrac etmə xətası:', error);
        return null;
      }
      
      // Kateqoriya sütunlarını əldə et
      const { data: columns, error: columnsError } = await supabase
        .from('columns')
        .select('*')
        .eq('category_id', categoryId)
        .order('order', { ascending: true });
      
      if (columnsError) {
        logger.error('Sütunları əldə etmə xətası:', columnsError);
        return null;
      }
      
      // Tarixçə məlumatlarını əldə et (əgər tələb olunursa)
      let historyData = [];
      if (options.includeHistory && data && data.length > 0) {
        const dataIds = data.map(item => item.id);
        const { data: history, error: historyError } = await supabase
          .from('data_history')
          .select(`
            *,
            users:changed_by(id, first_name, last_name)
          `)
          .in('data_id', dataIds);
        
        if (!historyError && history) {
          historyData = history;
        } else {
          logger.error('Tarixçə məlumatlarını əldə etmə xətası:', historyError);
        }
      }
      
      // İxrac formatına görə məlumatları hazırla və qaytar
      return await exportService.formatExportData(
        data || [],
        columns || [],
        historyData,
        options
      );
    } catch (error) {
      logger.error('Məlumatları ixrac etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Məktəb məlumatlarını ixrac et
   */
  exportSchoolData: async (schoolId: string, options: ExportOptions): Promise<Blob | null> => {
    try {
      // Məktəb məlumatlarını əldə et
      let query = supabase
        .from('data')
        .select(`
          *,
          schools:schools(id, name),
          categories:categories(id, name, description),
          created_by_user:users!created_by(id, first_name, last_name),
          approved_by_user:users!approved_by(id, first_name, last_name)
        `)
        .eq('school_id', schoolId);
      
      // Əlavə filtrləri tətbiq et
      if (options.filters) {
        if (options.filters.categoryId) {
          query = query.eq('category_id', options.filters.categoryId);
        }
        if (options.filters.status) {
          query = query.eq('status', options.filters.status);
        }
      }
      
      // Tarix aralığı filtrini tətbiq et
      if (options.dateRange) {
        query = query.gte('created_at', options.dateRange.start)
          .lte('created_at', options.dateRange.end);
      }
      
      const { data, error } = await query;
      
      if (error) {
        logger.error('Məlumatları ixrac etmə xətası:', error);
        return null;
      }
      
      // Əgər məlumat yoxdursa, boş nəticə qaytar
      if (!data || data.length === 0) {
        return new Blob(['No data available'], { type: 'text/plain' });
      }
      
      // Kateqoriya ID-lərini əldə et
      const categoryIds = [...new Set(data.map(item => item.category_id))];
      
      // Bütün kateqoriyalar üçün sütunları əldə et
      const { data: columns, error: columnsError } = await supabase
        .from('columns')
        .select('*')
        .in('category_id', categoryIds)
        .order('order', { ascending: true });
      
      if (columnsError) {
        logger.error('Sütunları əldə etmə xətası:', columnsError);
        return null;
      }
      
      // Tarixçə məlumatlarını əldə et (əgər tələb olunursa)
      let historyData = [];
      if (options.includeHistory && data && data.length > 0) {
        const dataIds = data.map(item => item.id);
        const { data: history, error: historyError } = await supabase
          .from('data_history')
          .select(`
            *,
            users:changed_by(id, first_name, last_name)
          `)
          .in('data_id', dataIds);
        
        if (!historyError && history) {
          historyData = history;
        } else {
          logger.error('Tarixçə məlumatlarını əldə etmə xətası:', historyError);
        }
      }
      
      // İxrac formatına görə məlumatları hazırla və qaytar
      return await exportService.formatExportData(
        data,
        columns || [],
        historyData,
        options
      );
    } catch (error) {
      logger.error('Məlumatları ixrac etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Region məlumatlarını ixrac et
   */
  exportRegionData: async (regionId: string, options: ExportOptions): Promise<Blob | null> => {
    try {
      // Əvvəlcə regiondakı məktəbləri əldə et
      const { data: schools, error: schoolsError } = await supabase
        .from('schools')
        .select('id')
        .eq('region_id', regionId);
      
      if (schoolsError) {
        logger.error('Məktəbləri əldə etmə xətası:', schoolsError);
        return null;
      }
      
      if (!schools || schools.length === 0) {
        return new Blob(['No schools in this region'], { type: 'text/plain' });
      }
      
      // Məktəb ID-lərini əldə et
      const schoolIds = schools.map(school => school.id);
      
      // Məktəblərin məlumatlarını əldə et
      let query = supabase
        .from('data')
        .select(`
          *,
          schools:schools(id, name),
          categories:categories(id, name, description),
          created_by_user:users!created_by(id, first_name, last_name),
          approved_by_user:users!approved_by(id, first_name, last_name)
        `)
        .in('school_id', schoolIds);
      
      // Əlavə filtrləri tətbiq et
      if (options.filters) {
        if (options.filters.categoryId) {
          query = query.eq('category_id', options.filters.categoryId);
        }
        if (options.filters.status) {
          query = query.eq('status', options.filters.status);
        }
      }
      
      // Tarix aralığı filtrini tətbiq et
      if (options.dateRange) {
        query = query.gte('created_at', options.dateRange.start)
          .lte('created_at', options.dateRange.end);
      }
      
      const { data, error } = await query;
      
      if (error) {
        logger.error('Məlumatları ixrac etmə xətası:', error);
        return null;
      }
      
      // Əgər məlumat yoxdursa, boş nəticə qaytar
      if (!data || data.length === 0) {
        return new Blob(['No data available'], { type: 'text/plain' });
      }
      
      // Kateqoriya ID-lərini əldə et
      const categoryIds = [...new Set(data.map(item => item.category_id))];
      
      // Bütün kateqoriyalar üçün sütunları əldə et
      const { data: columns, error: columnsError } = await supabase
        .from('columns')
        .select('*')
        .in('category_id', categoryIds)
        .order('order', { ascending: true });
      
      if (columnsError) {
        logger.error('Sütunları əldə etmə xətası:', columnsError);
        return null;
      }
      
      // İxrac formatına görə məlumatları hazırla və qaytar
      return await exportService.formatExportData(
        data,
        columns || [],
        [], // Tarixçə məlumatlarını daxil etmirik
        options
      );
    } catch (error) {
      logger.error('Məlumatları ixrac etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Hesabat məlumatlarını ixrac et
   */
  exportReportData: async (reportData: any[], reportTitle: string, options: ExportOptions): Promise<Blob | null> => {
    try {
      // Hesabat məlumatlarını birbaşa formatla və qaytar
      // Bu, hesabat generasiyası zamanı əldə edilmiş məlumatları ixrac edir
      
      // Məlumatları formatla
      let blob: Blob | null = null;
      
      switch (options.format) {
        case 'xlsx':
          blob = await exportService.formatXLSX(reportData, reportTitle);
          break;
        case 'csv':
          blob = await exportService.formatCSV(reportData);
          break;
        case 'pdf':
          blob = await exportService.formatPDF(reportData, reportTitle);
          break;
        case 'json':
          blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
          break;
        default:
          blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      }
      
      return blob;
    } catch (error) {
      logger.error('Hesabat məlumatlarını ixrac etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * İxrac məlumatlarını formatla
   */
  formatExportData: async (
    data: any[],
    columns: Column[],
    historyData: any[],
    options: ExportOptions
  ): Promise<Blob | null> => {
    try {
      // Məlumatları formatla
      let blob: Blob | null = null;
      
      // Məlumatları formatla
      const formattedData = data.map(item => {
        const result: Record<string, any> = {
          ID: item.id,
          Category: item.categories?.name || '',
          School: item.schools?.name || '',
          Status: item.status,
          Created: new Date(item.created_at).toLocaleString(),
          'Created By': `${item.created_by_user?.first_name || ''} ${item.created_by_user?.last_name || ''}`,
        };
        
        // Dinamik sütunlar üçün məlumatları əlavə et
        if (item.data && typeof item.data === 'object') {
          // Hər bir sütun üçün məlumatı əlavə et
          columns.forEach(column => {
            if (column.category_id === item.category_id) {
              result[column.name] = item.data[column.id] || '';
            }
          });
        }
        
        // Əlavə meta məlumatları əlavə et (əgər tələb olunursa)
        if (options.includeMetadata) {
          result['Approved At'] = item.approved_at ? new Date(item.approved_at).toLocaleString() : '';
          result['Approved By'] = item.approved_by_user ? 
            `${item.approved_by_user.first_name || ''} ${item.approved_by_user.last_name || ''}` : '';
          result['Rejection Reason'] = item.rejection_reason || '';
          result['Submitted At'] = item.submitted_at ? new Date(item.submitted_at).toLocaleString() : '';
          result['Updated At'] = item.updated_at ? new Date(item.updated_at).toLocaleString() : '';
        }
        
        return result;
      });
      
      // Tarixçə məlumatlarını əlavə et (əgər tələb olunursa)
      let formattedHistory: Record<string, any>[] = [];
      if (options.includeHistory && historyData.length > 0) {
        formattedHistory = historyData.map(item => {
          return {
            'Data ID': item.data_id,
            'Changed At': new Date(item.changed_at).toLocaleString(),
            'Changed By': item.users ? `${item.users.first_name || ''} ${item.users.last_name || ''}` : '',
            'Status': item.status,
            'Data': JSON.stringify(item.data)
          };
        });
      }
      
      // İxrac formatına görə məlumatları hazırla
      switch (options.format) {
        case 'xlsx':
          blob = await exportService.formatXLSX(formattedData, 'Data Export', formattedHistory);
          break;
        case 'csv':
          blob = await exportService.formatCSV(formattedData);
          break;
        case 'pdf':
          blob = await exportService.formatPDF(formattedData, 'Data Export');
          break;
        case 'json':
          const jsonData = {
            data: formattedData,
            ...(options.includeHistory && { history: formattedHistory })
          };
          blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
          break;
        default:
          blob = new Blob([JSON.stringify(formattedData, null, 2)], { type: 'application/json' });
      }
      
      return blob;
    } catch (error) {
      logger.error('Məlumatları formatlama xətası:', error);
      return null;
    }
  },
  
  /**
   * Məlumatları XLSX formatına çevir
   */
  formatXLSX: async (data: any[], sheetName: string, additionalData?: any[]): Promise<Blob> => {
    try {
      // Bu funksiya xlsx kitabxanasından istifadə edərək Excel faylı yaradacaq
      // Nümayiş üçün sadə bir mətn blob-u qaytar
      return new Blob([`XLSX format for ${sheetName} with ${data.length} rows`], { type: 'text/plain' });
      
      // Real tətbiqdə bu şəkildə olacaq:
      /*
      import * as XLSX from 'xlsx';
      
      // Workbook yarat
      const wb = XLSX.utils.book_new();
      
      // Əsas məlumatlar üçün worksheet yarat
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      
      // Əlavə məlumatlar varsa, onlar üçün də worksheet yarat
      if (additionalData && additionalData.length > 0) {
        const historyWs = XLSX.utils.json_to_sheet(additionalData);
        XLSX.utils.book_append_sheet(wb, historyWs, 'History');
      }
      
      // XLSX faylını yarat və qaytar
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      */
    } catch (error) {
      logger.error('XLSX formatlama xətası:', error);
      throw error;
    }
  },
  
  /**
   * Məlumatları CSV formatına çevir
   */
  formatCSV: async (data: any[]): Promise<Blob> => {
    try {
      // Bu funksiya məlumatları CSV formatına çevirəcək
      // Nümayiş üçün sadə bir mətn blob-u qaytar
      return new Blob([`CSV format with ${data.length} rows`], { type: 'text/plain' });
      
      // Real tətbiqdə bu şəkildə olacaq:
      /*
      // Başlıqları əldə et
      const headers = Object.keys(data[0] || {});
      
      // CSV başlıq sətri
      let csv = headers.join(',') + '\n';
      
      // Məlumat sətirlərini əlavə et
      data.forEach(row => {
        const values = headers.map(header => {
          const value = row[header] || '';
          // Vergül və dırnaq işarələrini düzgün işlə
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        });
        csv += values.join(',') + '\n';
      });
      
      return new Blob([csv], { type: 'text/csv;charset=utf-8' });
      */
    } catch (error) {
      logger.error('CSV formatlama xətası:', error);
      throw error;
    }
  },
  
  /**
   * Məlumatları PDF formatına çevir
   */
  formatPDF: async (data: any[], title: string): Promise<Blob> => {
    try {
      // Bu funksiya jspdf kitabxanasından istifadə edərək PDF faylı yaradacaq
      // Nümayiş üçün sadə bir mətn blob-u qaytar
      return new Blob([`PDF format for ${title} with ${data.length} rows`], { type: 'text/plain' });
      
      // Real tətbiqdə bu şəkildə olacaq:
      /*
      import { jsPDF } from 'jspdf';
      import 'jspdf-autotable';
      
      const doc = new jsPDF();
      
      // Başlıq əlavə et
      doc.text(title, 14, 15);
      
      // Cədvəl başlıqlarını və məlumatlarını hazırla
      const headers = Object.keys(data[0] || {});
      const rows = data.map(row => headers.map(header => row[header] || ''));
      
      // Avtomatik cədvəl yarat
      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 20,
        margin: { top: 20 },
        styles: { overflow: 'linebreak' },
        columnStyles: { 0: { cellWidth: 'auto' } }
      });
      
      // PDF-i blob kimi qaytar
      return doc.output('blob');
      */
    } catch (error) {
      logger.error('PDF formatlama xətası:', error);
      throw error;
    }
  }
};

export default exportService;
