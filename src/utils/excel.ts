
import { ColumnData } from '@/services/api/categoryService';

export const generateExcelTemplate = (columns: ColumnData[], blob: Blob) => {
  // Create a temporary URL to the file
  const url = window.URL.createObjectURL(blob);
  
  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'template.xlsx');
  
  // Append the link to body, click it, and then remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  window.URL.revokeObjectURL(url);
};

export const formatExcelData = (data: any[], columns: ColumnData[]) => {
  // Create header row
  const headers = columns.map(column => column.name);
  
  // Format data rows
  const rows = data.map(item => {
    return columns.map(column => {
      const value = item[column.id as string];
      
      // Format based on column type
      switch (column.type) {
        case 'date':
          return value ? new Date(value).toLocaleDateString() : '';
        case 'checkbox':
          return value ? 'Yes' : 'No';
        default:
          return value || '';
      }
    });
  });
  
  return [headers, ...rows];
};

export const parseExcelData = (data: any[][], columns: ColumnData[]) => {
  // First row is headers
  const headers = data[0];
  
  // Map column IDs to positions in Excel file
  const columnMap = columns.reduce((map, column, index) => {
    const headerIndex = headers.findIndex(header => 
      header.toLowerCase() === column.name.toLowerCase()
    );
    
    if (headerIndex !== -1) {
      map[column.id as string] = headerIndex;
    }
    
    return map;
  }, {} as Record<string, number>);
  
  // Process data rows
  return data.slice(1).map(row => {
    const result: Record<string, any> = {};
    
    columns.forEach(column => {
      const columnId = column.id as string;
      if (columnMap[columnId] !== undefined) {
        const value = row[columnMap[columnId]];
        
        // Convert based on column type
        switch (column.type) {
          case 'number':
            result[columnId] = value !== undefined && value !== '' ? Number(value) : null;
            break;
          case 'date':
            result[columnId] = value ? new Date(value).toISOString() : null;
            break;
          case 'checkbox':
            result[columnId] = value === 'Yes' || value === true;
            break;
          default:
            result[columnId] = value !== undefined ? String(value) : '';
        }
      }
    });
    
    return result;
  });
};
