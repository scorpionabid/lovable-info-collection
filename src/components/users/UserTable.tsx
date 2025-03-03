
import { useState } from "react";
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

// Mock data for demonstration
const mockUsers = [
  {
    id: "1",
    name: "Əli",
    surname: "Məmmədov",
    email: "ali.mammadov@example.com",
    role: "super-admin",
    entity: "Bütün sistem",
    lastActive: "2023-06-12T09:30:00",
    status: "active",
    avatarUrl: "",
  },
  {
    id: "2",
    name: "Aygün",
    surname: "Əliyeva",
    email: "aygun.aliyeva@example.com",
    role: "region-admin",
    entity: "Bakı regionu",
    lastActive: "2023-06-11T14:45:00",
    status: "active",
    avatarUrl: "",
  },
  {
    id: "3",
    name: "Orxan",
    surname: "Həsənli",
    email: "orxan.hasanli@example.com",
    role: "sector-admin",
    entity: "Yasamal sektoru",
    lastActive: "2023-06-10T11:20:00",
    status: "inactive",
    avatarUrl: "",
  },
  {
    id: "4",
    name: "Leyla",
    surname: "Quliyeva",
    email: "leyla.guliyeva@example.com",
    role: "school-admin",
    entity: "134 nömrəli məktəb",
    lastActive: "2023-06-09T16:15:00",
    status: "active",
    avatarUrl: "",
  },
  {
    id: "5",
    name: "Rəşad",
    surname: "Məlikzadə",
    email: "rashad.malikzade@example.com",
    role: "sector-admin",
    entity: "Nəsimi sektoru",
    lastActive: "2023-06-08T10:05:00",
    status: "active",
    avatarUrl: "",
  },
  {
    id: "6",
    name: "Nərgiz",
    surname: "Əhmədova",
    email: "nargiz.ahmadova@example.com",
    role: "school-admin",
    entity: "220 nömrəli məktəb",
    lastActive: "2023-06-07T13:40:00",
    status: "blocked",
    avatarUrl: "",
  },
  {
    id: "7",
    name: "Elçin",
    surname: "Hüseynzadə",
    email: "elchin.huseynzade@example.com",
    role: "region-admin",
    entity: "Gəncə regionu",
    lastActive: "2023-06-06T09:15:00",
    status: "active",
    avatarUrl: "",
  },
  {
    id: "8",
    name: "Sevda",
    surname: "Kərimova",
    email: "sevda.kerimova@example.com",
    role: "school-admin",
    entity: "45 nömrəli məktəb",
    lastActive: "2023-06-05T15:30:00",
    status: "inactive",
    avatarUrl: "",
  },
];

interface UserTableProps {
  selectedRows: string[];
  onSelectedRowsChange: (rows: string[]) => void;
}

export const UserTable = ({ selectedRows, onSelectedRowsChange }: UserTableProps) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewUser, setViewUser] = useState<typeof mockUsers[0] | null>(null);
  const [editUser, setEditUser] = useState<typeof mockUsers[0] | null>(null);
  const { toast } = useToast();

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === mockUsers.length) {
      onSelectedRowsChange([]);
    } else {
      onSelectedRowsChange(mockUsers.map(user => user.id));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      onSelectedRowsChange(selectedRows.filter(rowId => rowId !== id));
    } else {
      onSelectedRowsChange([...selectedRows, id]);
    }
  };

  const handleAction = (action: string, user: typeof mockUsers[0]) => {
    switch (action) {
      case 'view':
        setViewUser(user);
        break;
      case 'edit':
        setEditUser(user);
        break;
      case 'block':
        toast({
          title: "İstifadəçi bloklandı",
          description: `${user.name} ${user.surname} bloklandı`,
        });
        break;
      case 'activate':
        toast({
          title: "İstifadəçi aktivləşdirildi",
          description: `${user.name} ${user.surname} aktivləşdirildi`,
        });
        break;
      case 'reset':
        toast({
          title: "Şifrə sıfırlandı",
          description: `${user.name} ${user.surname} üçün şifrə sıfırlama e-poçtu göndərildi`,
        });
        break;
      case 'delete':
        toast({
          title: "İstifadəçi silindi",
          description: `${user.name} ${user.surname} silindi`,
          variant: "destructive",
        });
        break;
      default:
        break;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('az-AZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super-admin':
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

  const getRoleName = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'SuperAdmin';
      case 'region-admin':
        return 'Region Admin';
      case 'sector-admin':
        return 'Sektor Admin';
      case 'school-admin':
        return 'Məktəb Admin';
      default:
        return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'inactive':
        return 'Qeyri-aktiv';
      case 'blocked':
        return 'Bloklanmış';
      default:
        return status;
    }
  };

  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`;
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-infoline-lightest-gray">
            <tr>
              <th className="px-4 py-3 text-left">
                <Checkbox 
                  checked={selectedRows.length === mockUsers.length && mockUsers.length > 0} 
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
            {mockUsers.map(user => (
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
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-infoline-light-blue text-white">
                        {getInitials(user.name, user.surname)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-infoline-dark-blue">
                        {user.name} {user.surname}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-infoline-dark-gray">
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  <Badge className={`${getRoleColor(user.role)} font-normal`}>
                    {getRoleName(user.role)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-infoline-dark-gray">{user.entity}</td>
                <td className="px-4 py-3 text-infoline-dark-gray">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(user.lastActive)}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge className={`${getStatusColor(user.status)} font-normal`}>
                    {getStatusName(user.status)}
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
                      {user.status === 'active' ? (
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
        <UserModal user={editUser} onClose={() => setEditUser(null)} />
      )}
    </>
  );
};
