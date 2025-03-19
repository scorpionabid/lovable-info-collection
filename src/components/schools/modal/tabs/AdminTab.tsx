
import { useAdminAssignment } from './hooks/useAdminAssignment';
import { ExistingAdminSelector } from './components/ExistingAdminSelector';
import { NewAdminCreator } from './components/NewAdminCreator';
import { type User } from '@/services/userService/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserCircle } from "lucide-react";

interface AdminTabProps {
  schoolId?: string;
}

export const AdminTab = ({ schoolId }: AdminTabProps) => {
  const {
    users,
    isLoading,
    selectedUserId,
    setSelectedUserId,
    isAssigning,
    newAdmin,
    setNewAdmin,
    handleAssignAdmin,
    handleCreateAdmin,
    generateRandomPassword,
    currentAdmin
  } = useAdminAssignment(schoolId);

  const renderCurrentAdmin = (admin: User | null) => {
    if (!admin) return null;
    
    return (
      <Alert className="mb-4 bg-green-50 border-green-200">
        <UserCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800 ml-2">Məktəbin Administratoru</AlertTitle>
        <AlertDescription className="text-green-700 ml-2">
          <p><strong>{admin.first_name} {admin.last_name}</strong></p>
          <p className="text-sm">{admin.email}</p>
          {admin.phone && <p className="text-sm">{admin.phone}</p>}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="space-y-4">
      {currentAdmin && renderCurrentAdmin(currentAdmin)}
      
      <ExistingAdminSelector
        users={users}
        isLoading={isLoading}
        selectedUserId={selectedUserId}
        onSelectUser={setSelectedUserId}
        isAssigning={isAssigning}
        onAssign={handleAssignAdmin}
      />
      
      <div className="flex items-center">
        <div className="flex-grow border-t border-infoline-light-gray"></div>
        <span className="px-4 text-sm text-infoline-dark-gray">və ya</span>
        <div className="flex-grow border-t border-infoline-light-gray"></div>
      </div>
      
      <NewAdminCreator
        newAdmin={newAdmin}
        onUpdateNewAdmin={setNewAdmin}
        isAssigning={isAssigning}
        onCreate={() => handleCreateAdmin(schoolId || '', newAdmin)}
        onGenerateNewPassword={generateRandomPassword}
      />
    </div>
  );
};
