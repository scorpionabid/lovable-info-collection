
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { exportToExcel, ExcelColumn } from './excelUtils';

// Export options
export type ExportFormat = 'excel' | 'pdf' | 'csv';

// Helper function to convert data for CSV
const convertToCSV = (data: any[], columns: ExcelColumn[]): string => {
  // Create header row
  const headers = columns.map(col => `"${col.header}"`).join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return columns.map(col => {
      const value = item[col.key];
      // Escape quotes and wrap in quotes
      return `"${String(value || '').replace(/"/g, '""')}"`;
    }).join(',');
  });
  
  return [headers, ...rows].join('\n');
};

// Export data to CSV
export const exportToCSV = (
  data: any[],
  columns: ExcelColumn[],
  fileName: string
): void => {
  const csvContent = convertToCSV(data, columns);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${fileName}.csv`);
};

// Export data to PDF
export const exportToPDF = (
  data: any[],
  columns: ExcelColumn[],
  fileName: string,
  title: string,
  orientation: 'portrait' | 'landscape' = 'portrait'
): void => {
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  });
  
  // Add title
  doc.setFontSize(14);
  doc.text(title, 14, 22);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  
  // Prepare data for autotable
  const headers = columns.map(col => col.header);
  const rows = data.map(item => columns.map(col => item[col.key]));
  
  // Add table
  (doc as any).autoTable({
    head: [headers],
    body: rows,
    startY: 40,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { top: 40, right: 14, bottom: 20, left: 14 }
  });
  
  // Save PDF
  doc.save(`${fileName}.pdf`);
};

// Generic export function
export const exportData = (
  data: any[],
  columns: ExcelColumn[],
  format: ExportFormat,
  fileName: string,
  title: string = 'Export',
  orientation: 'portrait' | 'landscape' = 'portrait'
): void => {
  switch (format) {
    case 'excel':
      exportToExcel(data, columns, fileName);
      break;
    case 'pdf':
      exportToPDF(data, columns, fileName, title, orientation);
      break;
    case 'csv':
      exportToCSV(data, columns, fileName);
      break;
  }
};
