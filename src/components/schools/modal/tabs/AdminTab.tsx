
import { useAdminAssignment } from './hooks/useAdminAssignment';
import { ExistingAdminSelector } from './components/ExistingAdminSelector';
import { NewAdminCreator } from './components/NewAdminCreator';

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
    handleCreateAdmin
  } = useAdminAssignment(schoolId);

  return (
    <div className="space-y-4">
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
        onCreate={handleCreateAdmin}
      />
    </div>
  );
};
