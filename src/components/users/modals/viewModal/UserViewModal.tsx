
import React from 'react';
import { User } from '@/lib/supabase/types/user';
import { Modal } from '@/components/ui/modal';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getUserRoleName, getUserEntity, getUserStatusBadge, getUserStatusColor, getUserStatusText, getUserRoleBadgeColor } from '../../utils/userUtils';
import { formatDate } from '@/utils/dateUtils';

interface UserViewModalProps {
  user: User;
  onClose: () => void;
}

export const UserViewModal: React.FC<UserViewModalProps> = ({ user, onClose }) => {
  return (
    <Modal title="İstifadəçi Məlumatları" isOpen={true} onClose={onClose}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Ad Soyad</Label>
              <div className="text-base font-semibold mt-1">{user.first_name} {user.last_name}</div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Email</Label>
              <div className="text-base mt-1">{user.email}</div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Telefon</Label>
              <div className="text-base mt-1">{user.phone || '-'}</div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">UTIS Kodu</Label>
              <div className="text-base mt-1">{user.utis_code || '-'}</div>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Rolu</Label>
              <div className="mt-1">
                <Badge className={getUserRoleBadgeColor(user)}>
                  {getUserRoleName(user)}
                </Badge>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Təşkilat</Label>
              <div className="text-base mt-1">{getUserEntity(user) || '-'}</div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Status</Label>
              <div className="mt-1">
                <Badge className={getUserStatusColor(user.is_active)}>
                  {getUserStatusText(user.is_active)}
                </Badge>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Son Giriş</Label>
              <div className="text-base mt-1">{user.last_login ? formatDate(user.last_login) : 'Heç vaxt'}</div>
            </div>
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium text-gray-500">Yaradılma Tarixi</Label>
          <div className="text-base mt-1">{formatDate(user.created_at)}</div>
        </div>
      </div>
    </Modal>
  );
};

export default UserViewModal;
