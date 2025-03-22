
import { useState } from 'react';
import { User } from '@/lib/supabase/types/user';
import * as xlsx from 'xlsx';

export const useUserExport = () => {
  const [loading, setLoading] = useState(false);

  const exportToExcel = async (users: User[], fileName = 'users-export.xlsx') => {
    try {
      setLoading(true);
      
      // Map users to a format appropriate for export
      const data = users.map(user => ({
        'First Name': user.first_name,
        'Last Name': user.last_name,
        'Email': user.email,
        'Phone': user.phone || '',
        'Role': user.role || '', // Use role instead of roles
        'UTIS Code': user.utis_code || '',
        'Status': user.is_active ? 'Active' : 'Inactive',
        'Last Login': user.last_login ? new Date(user.last_login).toLocaleString() : 'Never',
        'Created At': user.created_at ? new Date(user.created_at).toLocaleString() : ''
      }));
      
      // Create workbook and worksheet
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.json_to_sheet(data);
      
      // Add worksheet to workbook
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');
      
      // Write to file and trigger download
      xlsx.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Error exporting users:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { exportToExcel, loading };
};
