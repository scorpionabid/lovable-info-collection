
import React, { useState } from 'react';
import { User } from '@/supabase/types';
import { Button } from '@/components/ui/button';
import { Edit, Lock, PowerOff, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUserMutation } from '@/hooks/users/useUserMutation';
import { toast } from 'sonner';

interface UserActionsProps {
  user: User;
  onClose: () => void;
}

export const UserActions: React.FC<UserActionsProps> = ({ user, onClose }) => {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [passwordResetDialog, setPasswordResetDialog] = useState(false);
  const [statusChangeDialog, setStatusChangeDialog] = useState(false);
  
  const { updateUser, deleteUser, resetUserPassword, isLoading } = useUserMutation();
  
  const handleEdit = () => {
    // Just close the view modal, parent component should handle opening edit modal
    onClose();
  };
  
  const handleDelete = async () => {
    try {
      await deleteUser(user.id);
      toast.success('İstifadəçi uğurla silindi');
      setDeleteDialog(false);
      onClose();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('İstifadəçi silinərkən xəta baş verdi');
    }
  };
  
  const handleResetPassword = async () => {
    try {
      await resetUserPassword(user.id);
      toast.success('Şifrə sıfırlama e-poçtu göndərildi');
      setPasswordResetDialog(false);
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Şifrə sıfırlanarkən xəta baş verdi');
    }
  };
  
  const handleToggleStatus = async () => {
    try {
      await updateUser(user.id, { is_active: !user.is_active });
      toast.success(user.is_active 
        ? 'İstifadəçi uğurla deaktiv edildi' 
        : 'İstifadəçi uğurla aktiv edildi'
      );
      setStatusChangeDialog(false);
      onClose();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('İstifadəçi statusu yenilərkən xəta baş verdi');
    }
  };

  return (
    <>
      <Card className="mt-4">
        <CardContent className="space-y-2 pt-6">
          <Button 
            variant="outline" 
            className="w-full flex justify-start" 
            onClick={handleEdit}
          >
            <Edit className="mr-2 h-4 w-4" />
            Redaktə etmək
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex justify-start" 
            onClick={() => setPasswordResetDialog(true)}
          >
            <Lock className="mr-2 h-4 w-4" />
            Şifrəni sıfırla
          </Button>
          
          <Button 
            variant="outline" 
            className={`w-full flex justify-start ${
              user.is_active ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'
            }`}
            onClick={() => setStatusChangeDialog(true)}
          >
            <PowerOff className="mr-2 h-4 w-4" />
            {user.is_active ? 'Deaktiv et' : 'Aktiv et'}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex justify-start text-red-500 hover:text-red-600" 
            onClick={() => setDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Sil
          </Button>
        </CardContent>
      </Card>
      
      {/* Delete Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>İstifadəçini silmək istədiyinizə əminsiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu əməliyyat geri qaytarıla bilməz. Bu istifadəçi və bütün əlaqəli məlumatlar daimi olaraq silinəcək.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Ləğv et</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {isLoading ? 'Silinir...' : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Password Reset Dialog */}
      <AlertDialog open={passwordResetDialog} onOpenChange={setPasswordResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Şifrəni sıfırlamaq istədiyinizə əminsiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu istifadəçiyə şifrəni sıfırlamaq üçün təlimatları olan bir e-poçt göndəriləcək.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Ləğv et</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResetPassword} 
              disabled={isLoading}
            >
              {isLoading ? 'Göndərilir...' : 'Şifrəni sıfırla'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Status Change Dialog */}
      <AlertDialog open={statusChangeDialog} onOpenChange={setStatusChangeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              İstifadəçini {user.is_active ? 'deaktiv etmək' : 'aktiv etmək'} istədiyinizə əminsiniz?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {user.is_active 
                ? 'Deaktiv edildikdən sonra istifadəçi sistemə daxil ola bilməyəcək.' 
                : 'Aktiv edildikdən sonra istifadəçi sistemə daxil ola biləcək.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Ləğv et</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleStatus} 
              disabled={isLoading}
              className={user.is_active ? "bg-red-500 hover:bg-red-600" : ""}
            >
              {isLoading 
                ? (user.is_active ? 'Deaktiv edilir...' : 'Aktiv edilir...')
                : (user.is_active ? 'Deaktiv et' : 'Aktiv et')
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
