
import { 
  X, 
  Mail, 
  User as UserIcon, 
  Phone, 
  UserCheck, 
  MapPin, 
  Building, 
  School, 
  Calendar, 
  Shield,
  Map
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { az } from "date-fns/locale";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User } from "@/services/api/userService";

interface UserViewModalProps {
  user: User;
  onClose: () => void;
}

export const UserViewModal = ({ user, onClose }: UserViewModalProps) => {
  const getInitials = (name: string, surname: string) => {
    return `${name?.charAt(0) || ""}${surname?.charAt(0) || ""}`;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Heç vaxt";
    try {
      return format(parseISO(dateString), "dd MMMM yyyy, HH:mm", { locale: az });
    } catch (error) {
      return "Tarix xətası";
    }
  };

  const getRoleIcon = (role: string | undefined) => {
    if (!role) return UserCheck;
    
    if (role.includes("super")) return Shield;
    if (role.includes("region")) return Map;
    if (role.includes("sector")) return Building;
    return School;
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
    if (!role) return 'bg-gray-100 text-gray-800';
    
    if (role.includes("super")) return 'bg-red-100 text-red-800';
    if (role.includes("region")) return 'bg-blue-100 text-blue-800';
    if (role.includes("sector")) return 'bg-green-100 text-green-800';
    return 'bg-purple-100 text-purple-800';
  };

  const RoleIcon = getRoleIcon(user.roles?.name || user.role);

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>İstifadəçi Məlumatları</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" />
              <AvatarFallback className="bg-infoline-light-blue text-white text-xl">
                {getInitials(user.first_name, user.last_name)}
              </AvatarFallback>
            </Avatar>

            <div className="mt-4 text-center">
              <Badge className={`${getRoleColor(user.roles?.name || user.role)} font-normal`}>
                {getRoleName(user)}
              </Badge>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-infoline-dark-blue">
                {user.first_name} {user.last_name}
              </h2>
              <div className="flex items-center gap-1 text-infoline-dark-gray mt-1">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            </div>

            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <RoleIcon className="h-5 w-5 text-infoline-blue" />
                <div>
                  <p className="text-sm text-infoline-dark-gray">İstifadəçi rolu</p>
                  <p className="font-medium text-infoline-dark-blue">{getRoleName(user)}</p>
                </div>
              </div>
              
              {user.region_id && (
                <div className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-infoline-blue" />
                  <div>
                    <p className="text-sm text-infoline-dark-gray">Region</p>
                    <p className="font-medium text-infoline-dark-blue">Region ID: {user.region_id}</p>
                  </div>
                </div>
              )}
              
              {user.sector_id && (
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-infoline-blue" />
                  <div>
                    <p className="text-sm text-infoline-dark-gray">Sektor</p>
                    <p className="font-medium text-infoline-dark-blue">Sektor ID: {user.sector_id}</p>
                  </div>
                </div>
              )}
              
              {user.school_id && (
                <div className="flex items-center gap-2">
                  <School className="h-5 w-5 text-infoline-blue" />
                  <div>
                    <p className="text-sm text-infoline-dark-gray">Məktəb</p>
                    <p className="font-medium text-infoline-dark-blue">Məktəb ID: {user.school_id}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-infoline-blue" />
                <div>
                  <p className="text-sm text-infoline-dark-gray">Son aktivlik</p>
                  <p className="font-medium text-infoline-dark-blue">{formatDate(user.last_login)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-infoline-blue" />
                <div>
                  <p className="text-sm text-infoline-dark-gray">Status</p>
                  <p className="font-medium text-infoline-dark-blue">
                    {user.is_active ? "Aktiv" : "Qeyri-aktiv"}
                  </p>
                </div>
              </div>
            </div>
            
            {user.roles?.permissions && user.roles.permissions.length > 0 && (
              <>
                <Separator />
                
                <div>
                  <h3 className="font-medium text-infoline-dark-blue mb-2">İcazələr</h3>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="bg-infoline-lightest-gray">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Bağla</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
