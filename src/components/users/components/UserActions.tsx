
import { useState } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { confirm } from "@/components/ui/confirm";
import { User } from '@/services/api/userService';
import userService from "@/services/api/userService";
import { UserForm } from "../modals/UserForm";

interface UserActionsProps {
  onRefetch: () => void;
}

export const UserActions = ({ onRefetch }: UserActionsProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = async (user: User) => {
    const confirmed = await confirm({
      title: "Silmək istədiyinizə əminsiniz?",
      description: "Bu əməliyyatı geri almaq mümkün deyil",
    });

    if (!confirmed) return;

    try {
      await userService.deleteUser(user.id);
      toast("İstifadəçi uğurla silindi");
      onRefetch();
    } catch (error) {
      toast("İstifadəçini silərkən xəta baş verdi");
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
    onRefetch();
  };

  return {
    isFormOpen,
    selectedUser,
    handleEdit,
    handleDelete,
    handleFormSuccess,
    setIsFormOpen
  };
};
