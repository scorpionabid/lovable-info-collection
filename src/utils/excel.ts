import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ColumnData } from '@/components/categories/columns/types';

export const generateExcelTemplate = (
  categoryName: string,
  columns: ColumnData[]
): Blob => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([createColumnHeaders(columns)]);
  
  // Apply column validation
  columns.forEach((column, index) => {
    const validation = getColumnValidation(column);
    if (validation) {
      const cellAddress = XLSX.utils.encode_col(index) + '2:' + XLSX.utils.encode_col(index) + '1000';
      ws['!dataValidation'] = ws['!dataValidation'] || [];
      ws['!dataValidation'].push({
        sqref: cellAddress,
        ...validation
      });
    }
  });
  
  XLSX.utils.book_append_sheet(wb, ws, categoryName);
  const wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  const wbout = XLSX.write(wb, wopts);
  const blob = new Blob([new Uint8Array(wbout)], { type: 'application/octet-stream' });
  return blob;
};

export const parseExcelData = (
  file: File,
  columns: ColumnData[]
): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Remove header row
        jsonData.shift();
        
        const parsedData = jsonData.map(row => {
          const item: Record<string, any> = {};
          columns.forEach((column, index) => {
            const cellValue = row[index];
            item[column.name] = transformCellData(cellValue, column.type);
          });
          return item;
        });
        
        resolve(parsedData);
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

// Helper function to transform Excel cell data to proper data type
export const transformCellData = (value: any, columnType: string): any => {
  if (value === undefined || value === null) {
    return null;
  }
  
  switch (columnType) {
    case 'number':
      return Number(value);
    case 'date':
      return new Date(value);
    case 'boolean':
      return value.toLowerCase() === 'true';
    default:
      return String(value);
  }
};

export const exportDataToExcel = (
  data: Record<string, any>[],
  columns: ColumnData[],
  fileName: string
): void => {
  const wb = XLSX.utils.book_new();
  const header = createColumnHeaders(columns);
  const dataRows = data.map(item => columns.map(column => item[column.name]));
  
  // Add header row to data rows
  const ws = XLSX.utils.aoa_to_sheet([header, ...dataRows]);
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  
  const wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  const wbout = XLSX.write(wb, wopts);
  const blob = new Blob([new Uint8Array(wbout)], { type: 'application/octet-stream' });
  saveAs(blob, `${fileName}.xlsx`);
};

// Helper to create Excel column headers from column data
export const createColumnHeaders = (columns: ColumnData[]): string[] => {
  return columns.map(column => column.name);
};

// Helper to determine Excel column types and validation
export const getColumnValidation = (column: ColumnData): XLSX.DataValidation | undefined => {
  if (column.type === 'select' && column.options && column.options.length > 0) {
    return {
      type: 'list',
      formula1: `"${column.options.join(',')}"`,
      showDropDown: true
    };
  }
  
  if (column.type === 'date') {
    return {
      type: 'date',
      operator: 'between',
      formula1: '1900-01-01',
      formula2: '2100-12-31'
    };
  }
  
  if (column.type === 'number') {
    return {
      type: 'decimal',
      operator: 'between',
      formula1: '-1000000',
      formula2: '1000000'
    };
  }
  
  return undefined;
};
