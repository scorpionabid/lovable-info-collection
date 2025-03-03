
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface ExcelColumn {
  key: string;
  header: string;
  width?: number;
  required?: boolean;
  type?: 'text' | 'number' | 'date' | 'select';
  options?: string[];
  validation?: (value: any) => boolean | string;
}

export interface ExcelTemplate {
  name: string;
  sheets: {
    name: string;
    columns: ExcelColumn[];
  }[];
}

export interface ImportResult {
  success: boolean;
  data: any[];
  errors: {
    row: number;
    column: string;
    message: string;
  }[];
  totalRows: number;
  successRows: number;
  errorRows: number;
}

// Generate Excel template based on schema
export const generateExcelTemplate = (template: ExcelTemplate): void => {
  const workbook = XLSX.utils.book_new();
  
  template.sheets.forEach(sheet => {
    // Create header row
    const headers = sheet.columns.map(col => col.header);
    
    // Create empty data with headers only
    const data = [headers];
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    // Set column widths
    const colWidths = sheet.columns.map(col => ({ 
      wch: col.width || Math.max(col.header.length, 10) 
    }));
    worksheet['!cols'] = colWidths;
    
    // Add sheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
  });
  
  // Generate binary string
  const excelBinary = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
  
  // Convert binary to Blob
  const buffer = new ArrayBuffer(excelBinary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < excelBinary.length; i++) {
    view[i] = excelBinary.charCodeAt(i) & 0xFF;
  }
  
  // Create blob and save file
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  saveAs(blob, `${template.name}.xlsx`);
};

// Parse Excel file and validate data
export const parseExcelFile = async (
  file: File, 
  columns: ExcelColumn[],
  sheetName?: string
): Promise<ImportResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet if not specified
        const sheet = sheetName ? 
          workbook.Sheets[sheetName] : 
          workbook.Sheets[workbook.SheetNames[0]];
        
        if (!sheet) {
          reject(new Error(`Sheet ${sheetName || 'not found'}`));
          return;
        }
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        // Extract headers (first row)
        const fileHeaders = jsonData[0] as string[];
        
        // Map file headers to column keys
        const headerMap = new Map<number, string>();
        columns.forEach(col => {
          const index = fileHeaders.findIndex(h => h === col.header);
          if (index !== -1) {
            headerMap.set(index, col.key);
          }
        });
        
        // Process data rows
        const result: ImportResult = {
          success: true,
          data: [],
          errors: [],
          totalRows: jsonData.length - 1, // Exclude header row
          successRows: 0,
          errorRows: 0
        };
        
        // Skip header row, process data rows
        for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
          const row = jsonData[rowIndex] as any[];
          const rowData: any = {};
          let rowHasError = false;
          
          // Process each cell based on column mapping
          headerMap.forEach((colKey, colIndex) => {
            const column = columns.find(c => c.key === colKey);
            const cellValue = row[colIndex];
            
            // Skip processing if column not found
            if (!column) return;
            
            // Validate required fields
            if (column.required && (cellValue === undefined || cellValue === null || cellValue === '')) {
              result.errors.push({
                row: rowIndex,
                column: column.header,
                message: 'Required field is empty'
              });
              rowHasError = true;
              return;
            }
            
            // Type validation
            if (cellValue !== undefined && cellValue !== null && cellValue !== '') {
              let processedValue = cellValue;
              
              // Type conversion and validation
              switch (column.type) {
                case 'number':
                  if (isNaN(Number(cellValue))) {
                    result.errors.push({
                      row: rowIndex,
                      column: column.header,
                      message: 'Value must be a number'
                    });
                    rowHasError = true;
                    return;
                  }
                  processedValue = Number(cellValue);
                  break;
                  
                case 'date':
                  // Check if it's a valid date
                  const dateObj = new Date(cellValue);
                  if (isNaN(dateObj.getTime())) {
                    result.errors.push({
                      row: rowIndex,
                      column: column.header,
                      message: 'Invalid date format'
                    });
                    rowHasError = true;
                    return;
                  }
                  processedValue = dateObj.toISOString();
                  break;
                  
                case 'select':
                  if (column.options && !column.options.includes(String(cellValue))) {
                    result.errors.push({
                      row: rowIndex,
                      column: column.header,
                      message: `Value must be one of: ${column.options.join(', ')}`
                    });
                    rowHasError = true;
                    return;
                  }
                  break;
              }
              
              // Custom validation if provided
              if (column.validation && !rowHasError) {
                const validationResult = column.validation(processedValue);
                if (validationResult !== true) {
                  result.errors.push({
                    row: rowIndex,
                    column: column.header,
                    message: typeof validationResult === 'string' ? 
                      validationResult : 'Validation failed'
                  });
                  rowHasError = true;
                  return;
                }
              }
              
              // Set processed value
              rowData[colKey] = processedValue;
            }
          });
          
          if (rowHasError) {
            result.errorRows++;
          } else {
            result.data.push(rowData);
            result.successRows++;
          }
        }
        
        result.success = result.errors.length === 0;
        resolve(result);
        
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

// Export data to Excel
export const exportToExcel = (
  data: any[],
  columns: ExcelColumn[],
  fileName: string,
  sheetName: string = 'Data'
): void => {
  // Map data to rows with headers
  const headers = columns.map(col => col.header);
  
  // Convert data to array format
  const rows = data.map(item => {
    return columns.map(col => item[col.key]);
  });
  
  // Create worksheet with headers and data
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  
  // Set column widths
  const colWidths = columns.map(col => ({ 
    wch: col.width || Math.max(col.header.length, 10) 
  }));
  worksheet['!cols'] = colWidths;
  
  // Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Generate binary string
  const excelBinary = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
  
  // Convert binary to Blob
  const buffer = new ArrayBuffer(excelBinary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < excelBinary.length; i++) {
    view[i] = excelBinary.charCodeAt(i) & 0xFF;
  }
  
  // Create blob and save file
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  saveAs(blob, `${fileName}.xlsx`);
};
