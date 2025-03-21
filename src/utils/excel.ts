import * as XLSX from 'xlsx';

// XLSX tipləri ilə bağlı xətanı düzəltmək üçün DataValidation tipini əlavə edək
import { utils, SSF, WorkBook, WorkSheet, writeFile, read } from 'xlsx';

interface DataValidation {
  type: string;
  operator?: string;
  formula1: string;
  formula2?: string;
  allowBlank?: boolean;
  showErrorMessage?: boolean;
  showInputMessage?: boolean;
  errorTitle?: string;
  error?: string;
  promptTitle?: string;
  prompt?: string;
  sqref: string;
}

// Excel faylını yaratmaq
export const createExcelFile = (data: any[], sheetName: string, columns: any[]): XLSX.WorkBook => {
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: columns.map(col => col.key) });

  // Sütun adlarını əlavə et
  XLSX.utils.sheet_add_aoa(ws, [columns.map(col => col.label)], { origin: "A1" });

  // Sütunların enini təyin et
  const wscols = columns.map(col => ({ wch: col.width || 20 }));
  ws['!cols'] = wscols;

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return wb;
};

// Excel faylını yükləmək
export const downloadExcelFile = (workbook: XLSX.WorkBook, fileName: string): void => {
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// Excel faylını oxumaq
export const readExcelFile = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Birinci sətir sütun adlarıdır, onları çıxarırıq
        const headers = jsonData.shift() as string[];

        // Qalan sətirləri obyektlərə çeviririk
        const result = jsonData.map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });

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

// Excel faylından string dəyərlərini almaq
export const getStringValuesFromExcelFile = async (file: File, columnKey: string): Promise<string[]> => {
  try {
    const data = await readExcelFile(file);
    
    // Məlumatı yoxla
    if (!Array.isArray(data)) {
      console.error("Excel faylından məlumat alınmadı:", data);
      return [];
    }

    // Sütun dəyərlərini çıxar
    const columnValues = data.map(item => item[columnKey]).filter(Boolean);

    return columnValues as string[];
  } catch (error) {
    console.error("Excel faylından string dəyərlərini almaq xətası:", error);
    return [];
  }
};
