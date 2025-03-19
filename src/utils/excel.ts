
import * as XLSX from 'xlsx';
import { CategoryColumn } from '@/services/categoryService';

// Define ColumnData type
interface ColumnData extends CategoryColumn {
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
    options?: string[];
  };
}

// Function to export data to Excel
export const exportToExcel = (data: any[], fileName: string) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    // Auto-size columns
    const colWidths = estimateColumnWidths(data);
    worksheet['!cols'] = colWidths.map(width => ({ wch: width }));
    
    // Generate file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

// Helper to estimate column widths based on content
const estimateColumnWidths = (data: any[]) => {
  if (!data || data.length === 0) return [];
  
  const headers = Object.keys(data[0]);
  const widths = headers.map(header => {
    // Start with header length + some padding
    let maxWidth = header.length + 2;
    
    // Check content length in each row
    data.forEach(row => {
      const cellValue = row[header];
      if (cellValue !== null && cellValue !== undefined) {
        const cellValueStr = String(cellValue);
        if (cellValueStr.length > maxWidth) {
          maxWidth = cellValueStr.length + 2;
        }
      }
    });
    
    // Cap maximum width
    return Math.min(maxWidth, 50);
  });
  
  return widths;
};

// Function to generate Excel template based on columns definition
export const generateExcelTemplate = (columns: ColumnData[], fileName: string) => {
  try {
    // Create template header row
    const headerRow = columns.map(col => col.name);
    
    // Create empty data with just headers
    const worksheet = XLSX.utils.aoa_to_sheet([headerRow]);
    const workbook = XLSX.utils.book_new();
    
    // Set column widths
    worksheet['!cols'] = columns.map(col => {
      let width = col.name.length + 5;
      
      // Adjust width based on column type
      if (col.type === 'textarea') {
        width = 40;
      } else if (col.type === 'date') {
        width = 15;
      } else if (col.type === 'select' && col.options) {
        // Find longest option
        const maxOptionLength = Math.max(...col.options.map(opt => opt.length));
        width = Math.max(width, maxOptionLength + 5);
      }
      
      return { wch: width };
    });
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    
    // Generate file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error generating Excel template:', error);
    return false;
  }
};

// Function to parse Excel file to JSON
export const parseExcelToJson = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
        
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export default {
  exportToExcel,
  generateExcelTemplate,
  parseExcelToJson
};
