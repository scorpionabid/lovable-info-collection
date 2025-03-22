
import { useState } from 'react';
import { User } from '@/lib/supabase/types/user';
import { getUserRoleName } from '@/components/users/utils/userUtils';

export const useExportUsers = () => {
  const [loading, setLoading] = useState(false);

  const exportToExcel = async (users: User[], fileName: string = 'users.xlsx') => {
    setLoading(true);
    try {
      // In a real implementation, we would use a library like xlsx
      // For now, let's just create a simple CSV content
      const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Status', 'Created At'];
      
      const rows = users.map(user => [
        user.id,
        user.first_name,
        user.last_name,
        user.email,
        user.phone || '',
        getUserRoleName(user),
        user.is_active ? 'Active' : 'Inactive',
        user.created_at || ''
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create a blob and download it
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Export completed:', fileName);
    } catch (error) {
      console.error('Error exporting users:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    exportToExcel,
    loading
  };
};

export default useExportUsers;
