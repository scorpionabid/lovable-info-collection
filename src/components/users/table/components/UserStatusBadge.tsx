
import { Badge } from "@/components/ui/badge";

interface UserStatusBadgeProps {
  isActive: boolean | undefined;
}

export const UserStatusBadge = ({ isActive }: UserStatusBadgeProps) => {
  const getStatusColor = (isActive: boolean | undefined) => {
    if (isActive === undefined) return 'bg-gray-100 text-gray-800';
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusName = (isActive: boolean | undefined) => {
    if (isActive === undefined) return 'Naməlum';
    return isActive ? 'Aktiv' : 'Bloklanmış';
  };

  return (
    <Badge className={`${getStatusColor(isActive)} font-normal`}>
      {getStatusName(isActive)}
    </Badge>
  );
};
