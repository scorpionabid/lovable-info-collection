
import { Calendar, MoreHorizontal, Eye, Edit, Trash, Lock, CheckCircle, XCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { az } from "date-fns/locale";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/services/api/userService";
import { UserRole } from "@/contexts/AuthContext";

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onSelectRow: (id: string) => void;
  onAction: (action: string, user: User) => void;
}

export const UserTableRow = ({ user, isSelected, onSelectRow, onAction }: UserTableRowProps) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Heç vaxt";
    try {
      return format(parseISO(dateString), "dd.MM.yyyy HH:mm", { locale: az });
    } catch (error) {
      console.error("Date format error:", error);
      return "Tarix xətası";
    }
  };

  const getRoleName = (user: User) => {
    // Try to get role from roles relationship first
    const roleName = user.roles?.name || user.role;
    if (!roleName) return 'Rol təyin edilməyib';
    
    switch (roleName) {
      case 'super-admin':
      case 'superadmin':
        return 'SuperAdmin';
      case 'region-admin':
        return 'Region Admin';
      case 'sector-admin':
        return 'Sektor Admin';
      case 'school-admin':
        return 'Məktəb Admin';
      default:
        return roleName;
    }
  };

  const getRoleColor = (role: string | undefined) => {
    // Normalize role name
    const normalizedRole = getNormalizedRole(role);
    switch (normalizedRole) {
      case 'super-admin':
      case 'superadmin':
        return 'bg-red-100 text-red-800';
      case 'region-admin':
        return 'bg-blue-100 text-blue-800';
      case 'sector-admin':
        return 'bg-green-100 text-green-800';
      case 'school-admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNormalizedRole = (role: string | undefined): UserRole | undefined => {
    if (!role) return undefined;
    
    if (role === 'superadmin') return 'super-admin';
    if (role === 'super-admin') return 'super-admin';
    
    return role as UserRole;
  };

  const getEntityName = (user: User) => {
    if (user.school_id) return "Məktəb";
    if (user.sector_id) return "Sektor";
    if (user.region_id) return "Region";
    if (getRoleName(user).includes("Super")) return "Bütün sistem";
    return "Təyin edilməyib";
  };

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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  return (
    <tr className="hover:bg-infoline-lightest-gray transition-colors">
      <td className="px-4 py-3">
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={() => onSelectRow(user.id)}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-infoline-light-blue text-white">
              {getInitials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-infoline-dark-blue">
              {user.first_name} {user.last_name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-infoline-dark-gray">
        {user.email}
      </td>
      <td className="px-4 py-3">
        <Badge className={`${getRoleColor(user.roles?.name || user.role)} font-normal`}>
          {getRoleName(user)}
        </Badge>
      </td>
      <td className="px-4 py-3 text-infoline-dark-gray">{getEntityName(user)}</td>
      <td className="px-4 py-3 text-infoline-dark-gray">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{formatDate(user.last_login)}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge className={`${getStatusColor(user.is_active)} font-normal`}>
          {getStatusName(user.is_active)}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Əməliyyatlar</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAction('view', user)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Bax</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction('edit', user)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Redaktə et</span>
            </DropdownMenuItem>
            {user.is_active ? (
              <DropdownMenuItem onClick={() => onAction('block', user)}>
                <XCircle className="mr-2 h-4 w-4" />
                <span>Blokla</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onAction('activate', user)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>Aktivləşdir</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onAction('reset', user)}>
              <Lock className="mr-2 h-4 w-4" />
              <span>Şifrə sıfırla</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onAction('delete', user)}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Sil</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};
