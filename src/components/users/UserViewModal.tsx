
import { X, Calendar, Mail, Phone, User, MapPin, Shield, CheckCircle, Clock, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface UserViewModalProps {
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
    role: string;
    entity: string;
    lastActive: string;
    status: string;
    avatarUrl: string;
  };
  onClose: () => void;
}

export const UserViewModal = ({ user, onClose }: UserViewModalProps) => {
  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`;
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

  // Mock data for user activity
  const userActivity = [
    { date: "2023-06-12T09:30:00", action: "Sistemə daxil oldu", ip: "192.168.1.1" },
    { date: "2023-06-12T10:15:00", action: "Məktəb məlumatlarını yenilədi", ip: "192.168.1.1" },
    { date: "2023-06-11T14:45:00", action: "Yeni hesabat yaratdı", ip: "192.168.1.1" },
    { date: "2023-06-10T11:20:00", action: "İstifadəçi məlumatlarını dəyişdi", ip: "192.168.1.2" },
    { date: "2023-06-09T16:15:00", action: "Şifrəsini dəyişdi", ip: "192.168.1.3" },
  ];

  // Mock data for permissions
  const permissions = [
    { category: "İstifadəçilər", actions: ["Görmə", "Yaratma", "Redaktə", "Silmə"] },
    { category: "Məktəblər", actions: ["Görmə", "Yaratma", "Redaktə", "Silmə"] },
    { category: "Regionlar", actions: ["Görmə", "Yaratma", "Redaktə", "Silmə"] },
    { category: "Sektorlar", actions: ["Görmə", "Yaratma", "Redaktə", "Silmə"] },
    { category: "Hesabatlar", actions: ["Görmə", "Yaratma", "Redaktə", "İxrac"] },
  ];

  // Mock data for related entities
  const relatedEntities = [
    { type: "Region", name: "Bakı regionu" },
    { type: "Sektor", name: "Yasamal sektoru" },
    { type: "Sektor", name: "Nəsimi sektoru" },
    { type: "Məktəb", name: "134 nömrəli məktəb" },
    { type: "Məktəb", name: "220 nömrəli məktəb" },
  ];

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>İstifadəçi Təfərrüatları</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="flex flex-col items-center space-y-3 md:w-1/3">
            <Avatar className="h-28 w-28">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="bg-infoline-light-blue text-white text-2xl">
                {getInitials(user.name, user.surname)}
              </AvatarFallback>
            </Avatar>
            
            <h3 className="text-xl font-semibold text-infoline-dark-blue">
              {user.name} {user.surname}
            </h3>
            
            <Badge className={`${getRoleColor(user.role)} font-normal`}>
              {getRoleName(user.role)}
            </Badge>
            
            <Badge className={`${getStatusColor(user.status)} font-normal`}>
              {getStatusName(user.status)}
            </Badge>

            <Separator className="my-2" />
            
            <div className="w-full space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-infoline-dark-gray" />
                <span className="text-sm text-infoline-dark-gray">{user.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-infoline-dark-gray" />
                <span className="text-sm text-infoline-dark-gray">+994 50 123 45 67</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-infoline-dark-gray" />
                <span className="text-sm text-infoline-dark-gray">{user.entity}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-infoline-dark-gray" />
                <span className="text-sm text-infoline-dark-gray">Qeydiyyat: 01.01.2023</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-infoline-dark-gray" />
                <span className="text-sm text-infoline-dark-gray">
                  Son aktivlik: {formatDate(user.lastActive)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <Tabs defaultValue="activity">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="activity">Aktivlik</TabsTrigger>
                <TabsTrigger value="permissions">İcazələr</TabsTrigger>
                <TabsTrigger value="related">Əlaqəli Entitiylər</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-infoline-dark-blue">Aktivlik Tarixçəsi</h4>
                  
                  <div className="space-y-3">
                    {userActivity.map((activity, index) => (
                      <div key={index} className="bg-infoline-lightest-gray p-3 rounded-md">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-infoline-dark-blue">
                            {activity.action}
                          </span>
                          <span className="text-xs text-infoline-dark-gray">
                            IP: {activity.ip}
                          </span>
                        </div>
                        <div className="text-xs text-infoline-dark-gray">
                          {formatDate(activity.date)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="permissions" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-infoline-dark-blue">İcazələr və Səlahiyyətlər</h4>
                  
                  <div className="border rounded-md divide-y">
                    {permissions.map((permission, index) => (
                      <div key={index} className="p-3">
                        <h5 className="font-medium text-infoline-dark-blue mb-2">
                          {permission.category}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {permission.actions.map((action, i) => (
                            <div key={i} className="flex items-center gap-1 bg-infoline-lightest-gray px-2 py-1 rounded-md">
                              <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                              <span className="text-xs">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="related" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-infoline-dark-blue">Əlaqəli Entitiylər</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {relatedEntities.map((entity, index) => (
                      <div key={index} className="flex items-center gap-3 bg-infoline-lightest-gray p-3 rounded-md">
                        <div className="bg-infoline-light-blue/20 p-2 rounded-full">
                          <Building className="h-4 w-4 text-infoline-light-blue" />
                        </div>
                        <div>
                          <div className="text-xs text-infoline-dark-gray">{entity.type}</div>
                          <div className="text-sm font-medium text-infoline-dark-blue">{entity.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
