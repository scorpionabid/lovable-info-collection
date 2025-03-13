
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, FileDown } from "lucide-react";
import { UserTablePagination } from "./table/UserTablePagination";
import { UserTableToolbar } from "./table/UserTableToolbar";
import { UserForm } from "./modals/UserForm";
import { sortUsers } from "./utils/userUtils";
import { useUserExport } from "./hooks/useUserExport";
import { confirm } from "@/components/ui/confirm";
import userService, { User } from "@/services/api/userService";

export const UsersOverview = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { exportUsers } = useUserExport();

  const { data: usersData, refetch } = useQuery({
    queryKey: ['users', page, perPage, search, sortColumn, sortOrder],
    queryFn: () => userService.getUsers({
      sortBy: sortColumn || undefined,
      sortOrder: sortOrder,
      search: search || undefined,
      pageSize: perPage,
      page: page,
    })
  });

  useEffect(() => {
    setIsLoading(true);
    if (usersData) {
      handleFetchSuccess(usersData);
    }
  }, [usersData]);

  useEffect(() => {
    if (usersData && 'error' in usersData) {
      toast("İstifadəçiləri yükləyərkən xəta baş verdi", {
        description: usersData.error?.message,
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [usersData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

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
      refetch();
    } catch (error) {
      toast("İstifadəçini silərkən xəta baş verdi", {
        variant: "destructive"
      });
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
    refetch();
  };

  const handleExport = () => {
    if (!users) {
      toast("İxrac etmək üçün məlumat tapılmadı", {
        variant: "destructive"
      });
      return;
    }
    exportUsers(users);
  };

  // Add a user type adapter function
  const adaptUserData = (userData: any): User => {
    return {
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      role_id: userData.role_id || '', 
      region_id: userData.region_id,
      sector_id: userData.sector_id,
      school_id: userData.school_id,
      phone: userData.phone,
      utis_code: userData.utis_code,
      is_active: userData.is_active,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      last_login: userData.last_login,
      roles: userData.roles,
      role: userData.role || (userData.roles ? userData.roles.name : '')
    };
  };

  // Fix the sortUsers call by adapting the data
  const sortedUsers = sortUsers(
    users ? users.map(adaptUserData) : [],
    sortColumn,
    sortOrder as 'asc' | 'desc'
  );

  // Fix the setUsers call by using the adapter
  const handleFetchSuccess = (data: any) => {
    if (data && Array.isArray(data)) {
      setUsers(data.map(adaptUserData));
    } else if (data && 'data' in data && Array.isArray(data.data)) {
      setUsers(data.data.map(adaptUserData));
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">İstifadəçilər</h1>
        <Button onClick={() => navigate('/users/import')}>Import</Button>
      </div>

      <UserTableToolbar 
        search={search}
        onSearchChange={handleSearchChange}
        onExport={handleExport}
        onAddUser={() => setIsFormOpen(true)}
      />

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                Ad Soyad
                {sortColumn === 'name' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </TableHead>
              <TableHead onClick={() => handleSort('email')} className="cursor-pointer">
                Email
                {sortColumn === 'email' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </TableHead>
              <TableHead onClick={() => handleSort('role')} className="cursor-pointer">
                Rol
                {sortColumn === 'role' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </TableHead>
              <TableHead onClick={() => handleSort('entity')} className="cursor-pointer">
                Qurum
                {sortColumn === 'entity' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </TableHead>
              <TableHead onClick={() => handleSort('lastActive')} className="cursor-pointer">
                Son aktivlik
                {sortColumn === 'lastActive' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </TableHead>
              <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                Status
                {sortColumn === 'status' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </TableHead>
              <TableHead className="text-right">Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">Yüklənir...</TableCell>
              </TableRow>
            ) : sortedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">Məlumat tapılmadı</TableCell>
              </TableRow>
            ) : (
              sortedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.first_name} {user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.roles?.name || user.role}</TableCell>
                  <TableCell>{user.region_id}</TableCell>
                  <TableCell>{user.last_login ? new Date(user.last_login).toLocaleString() : 'Heç vaxt'}</TableCell>
                  <TableCell>{user.is_active ? 'Aktiv' : 'Deaktiv'}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleEdit(user)} variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                    <Button onClick={() => handleDelete(user)} variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserTablePagination
        page={page}
        perPage={perPage}
        totalItems={usersData && 'count' in usersData ? usersData.count : 0}
        setPage={setPage}
        setPerPage={setPerPage}
      />

      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        user={selectedUser}
      />
    </div>
  );
};
