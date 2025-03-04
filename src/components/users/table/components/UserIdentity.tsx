
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserIdentityProps {
  firstName: string;
  lastName: string;
}

export const UserIdentity = ({ firstName, lastName }: UserIdentityProps) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src="" />
        <AvatarFallback className="bg-infoline-light-blue text-white">
          {getInitials(firstName, lastName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium text-infoline-dark-blue">
          {firstName} {lastName}
        </div>
      </div>
    </div>
  );
};
