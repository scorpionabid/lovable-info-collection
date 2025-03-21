
import { User } from '@/supabase/types';
import { useState } from 'react';
import * as XLSX from 'xlsx';

export const useUserExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportUsers = async (users: User[]) => {
    try {
      setIsExporting(true);
      
      // Format users data for export
      const formattedUsers = users.map(user => ({
        'Full Name': `${user.first_name} ${user.last_name}`,
        'Email': user.email,
        'Phone': user.phone || 'N/A',
        'Role': user.roles?.name || 'Unknown',
        'Active': user.is_active ? 'Yes' : 'No',
        'UTIS Code': user.utis_code || 'N/A',
        'Last Login': user.last_login 
          ? new Date(user.last_login).toLocaleString() 
          : 'Never logged in'
      }));
      
      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedUsers);
      
      // Create a workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Create a Blob from the buffer
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return { exportUsers, isExporting };
};
