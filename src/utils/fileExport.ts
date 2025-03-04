
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ExportOptions {
  data: Record<string, any>[];
  fileName: string;
  fileType: 'xlsx' | 'csv' | 'pdf';
}

export const fileExport = async ({ data, fileName, fileType }: ExportOptions) => {
  if (fileType === 'xlsx' || fileType === 'csv') {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    const excelBuffer = XLSX.write(workbook, { bookType: fileType, type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    
    FileSaver.saveAs(fileData, `${fileName}.${fileType}`);
    return true;
  } else if (fileType === 'pdf') {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(fileName, 14, 15);
    
    // Prepare data for table
    const headers = Object.keys(data[0]);
    const rows = data.map(item => Object.values(item));
    
    // Add table
    (doc as any).autoTable({
      head: [headers],
      body: rows,
      startY: 25,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Save PDF
    doc.save(`${fileName}.pdf`);
    return true;
  }
  
  return false;
};

export default {
  fileExport
};
