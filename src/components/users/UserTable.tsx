
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash, 
  Lock, 
  CheckCircle, 
  XCircle,
  User,
  Calendar
} from "lucide-react";
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
import { UserViewModal } from "./UserViewModal";
import { UserModal } from "./UserModal";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/services/api/userService";
import userService from "@/services/api/userService";
import { UserRole } from "@/contexts/AuthContext";
import { format, parseISO } from "date-fns";
import { az } from "date-fns/locale";

interface UserTableProps {
  users: User[];
  selectedRows: string[];
  onSelectedRowsChange: (rows: string[]) => void;
  onRefetch: () => void;
}

export const UserTable = ({ users, selectedRows, onSelectedRowsChange, onRefetch }: UserTableProps) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Mutations
  const blockUserMutation = useMutation({
    mutationFn: (userId: string) => userService.blockUser(userId),
    onSuccess: () => {
      toast({
        title: "İstifadəçi bloklandı",
        description: "İstifadəçi uğurla bloklandı",
      });
      onRefetch();
    },
    onError: (error) => {
      toast({
        title: "Xəta baş verdi",
        description: `İstifadəçini bloklamaq mümkün olmadı: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  const activateUserMutation = useMutation({
    mutationFn: (userId: string) => userService.activateUser(userId),
    onSuccess: () => {
      toast({
        title: "İstifadəçi aktivləşdirildi",
        description: "İstifadəçi uğurla aktivləşdirildi",
      });
      onRefetch();
    },
    onError: (error) => {
      toast({
        title: "Xəta baş verdi",
        description: `İstifadəçini aktivləşdirmək mümkün olmadı: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      toast({
        title: "İstifadəçi silindi",
        description: "İstifadəçi uğurla silindi",
        variant: "destructive",
      });
      onRefetch();
    },
    onError: (error) => {
      toast({
        title: "Xəta baş verdi",
        description: `İstifadəçini silmək mümkün olmadı: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === users.length) {
      onSelectedRowsChange([]);
    } else {
      onSelectedRowsChange(users.map(user => user.id));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      onSelectedRowsChange(selectedRows.filter(rowId => rowId !== id));
    } else {
      onSelectedRowsChange([...selectedRows, id]);
    }
  };

  const handleAction = (action: string, user: User) => {
    switch (action) {
      case 'view':
        setViewUser(user);
        break;
      case 'edit':
        setEditUser(user);
        break;
      case 'block':
        blockUserMutation.mutate(user.id);
        break;
      case 'activate':
        activateUserMutation.mutate(user.id);
        break;
      case 'reset':
        // This would typically call a password reset function
        toast({
          title: "Şifrə sıfırlandı",
          description: `${user.first_name} ${user.last_name} üçün şifrə sıfırlama e-poçtu göndərildi`,
        });
        break;
      case 'delete':
        if (window.confirm(`${user.first_name} ${user.last_name} istifadəçisini silmək istədiyinizə əminsinizmi?`)) {
          deleteUserMutation.mutate(user.id);
        }
        break;
      default:
        break;
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Heç vaxt";
    try {
      return format(parseISO(dateString), "dd.MM.yyyy HH:mm", { locale: az });
    } catch (error) {
      console.error("Date format error:", error);
      return "Tarix xətası";
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

  const getEntityName = (user: User) => {
    // This would typically fetch the actual name based on the ID
    // For now, a placeholder
    if (user.school_id) return "Məktəb";
    if (user.sector_id) return "Sektor";
    if (user.region_id) return "Region";
    if (getRoleName(user).includes("Super")) return "Bütün sistem";
    return "Təyin edilməyib";
  };

  // Sort users if a sort field is specified
  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0;
    
    let valueA: any;
    let valueB: any;
    
    switch (sortField) {
      case 'name':
        valueA = a.first_name + a.last_name;
        valueB = b.first_name + b.last_name;
        break;
      case 'email':
        valueA = a.email;
        valueB = b.email;
        break;
      case 'role':
        valueA = getRoleName(a);
        valueB = getRoleName(b);
        break;
      case 'entity':
        valueA = getEntityName(a);
        valueB = getEntityName(b);
        break;
      case 'lastActive':
        valueA = a.last_login || '';
        valueB = b.last_login || '';
        break;
      case 'status':
        valueA = a.is_active ? 1 : 0;
        valueB = b.is_active ? 1 : 0;
        break;
      default:
        return 0;
    }
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-infoline-lightest-gray">
            <tr>
              <th className="px-4 py-3 text-left">
                <Checkbox 
                  checked={selectedRows.length === users.length && users.length > 0} 
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-infoline-dark-gray uppercase cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  <span>Ad Soyad</span>
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-infoline-dark-gray uppercase cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center gap-1">
                  <span>E-mail</span>
                  {sortField === 'email' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-infoline-dark-gray uppercase cursor-pointer"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center gap-1">
                  <span>Rol</span>
                  {sortField === 'role' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-infoline-dark-gray uppercase cursor-pointer"
                onClick={() => handleSort('entity')}
              >
                <div className="flex items-center gap-1">
                  <span>Təşkilat</span>
                  {sortField === 'entity' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-infoline-dark-gray uppercase cursor-pointer"
                onClick={() => handleSort('lastActive')}
              >
                <div className="flex items-center gap-1">
                  <span>Son aktivlik</span>
                  {sortField === 'lastActive' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-infoline-dark-gray uppercase cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-infoline-dark-gray uppercase">
                Əməliyyatlar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-infoline-light-gray">
            {sortedUsers.map(user => (
              <tr key={user.id} className="hover:bg-infoline-lightest-gray transition-colors">
                <td className="px-4 py-3">
                  <Checkbox 
                    checked={selectedRows.includes(user.id)} 
                    onCheckedChange={() => handleSelectRow(user.id)}
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
                      <DropdownMenuItem onClick={() => handleAction('view', user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Bax</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('edit', user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Redaktə et</span>
                      </DropdownMenuItem>
                      {user.is_active ? (
                        <DropdownMenuItem onClick={() => handleAction('block', user)}>
                          <XCircle className="mr-2 h-4 w-4" />
                          <span>Blokla</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleAction('activate', user)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span>Aktivləşdir</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleAction('reset', user)}>
                        <Lock className="mr-2 h-4 w-4" />
                        <span>Şifrə sıfırla</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleAction('delete', user)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Sil</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewUser && (
        <UserViewModal user={viewUser} onClose={() => setViewUser(null)} />
      )}

      {editUser && (
        <UserModal 
          user={editUser} 
          onClose={() => setEditUser(null)} 
          onSuccess={() => {
            onRefetch();
            setEditUser(null);
          }}
        />
      )}
    </>
  );
};
