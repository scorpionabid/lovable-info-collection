
import { useState } from "react";
import { 
  X, 
  Mail, 
  User, 
  Phone, 
  Shield, 
  Building, 
  Map, 
  School, 
  Upload, 
  Info,
  Check
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface UserModalProps {
  user?: {
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

export const UserModal = ({ user, onClose }: UserModalProps) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || "school-admin");
  const { toast } = useToast();
  const isEditing = !!user;

  const getInitials = (name: string, surname: string) => {
    return `${name?.charAt(0) || ""}${surname?.charAt(0) || ""}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: isEditing ? "İstifadəçi yeniləndi" : "İstifadəçi yaradıldı",
      description: isEditing 
        ? `${user.name} ${user.surname} məlumatları uğurla yeniləndi` 
        : "Yeni istifadəçi uğurla yaradıldı",
    });
    
    onClose();
  };

  // Mock permissions for checkboxes
  const permissionGroups = [
    {
      name: "İstifadəçi İdarəetməsi",
      permissions: [
        { id: "user-view", label: "İstifadəçiləri görmə" },
        { id: "user-create", label: "İstifadəçi yaratma" },
        { id: "user-edit", label: "İstifadəçi redaktə" },
        { id: "user-delete", label: "İstifadəçi silmə" },
      ]
    },
    {
      name: "Məktəb İdarəetməsi",
      permissions: [
        { id: "school-view", label: "Məktəbləri görmə" },
        { id: "school-create", label: "Məktəb yaratma" },
        { id: "school-edit", label: "Məktəb redaktə" },
        { id: "school-delete", label: "Məktəb silmə" },
      ]
    },
    {
      name: "Hesabat İdarəetməsi",
      permissions: [
        { id: "report-view", label: "Hesabatları görmə" },
        { id: "report-create", label: "Hesabat yaratma" },
        { id: "report-export", label: "Hesabat ixrac" },
      ]
    },
  ];

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            {isEditing ? "İstifadəçi Redaktəsi" : "Yeni İstifadəçi"}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profil Məlumatları</TabsTrigger>
              <TabsTrigger value="role">Rol və Təşkilat</TabsTrigger>
              <TabsTrigger value="permissions">İcazələr</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-4 space-y-4">
              <div className="flex flex-col items-center gap-4 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-infoline-light-blue text-white text-xl">
                    {isEditing ? getInitials(user.name, user.surname) : "YI"}
                  </AvatarFallback>
                </Avatar>
                
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Upload className="h-4 w-4" />
                  <span>Profil şəkli yüklə</span>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ad</Label>
                  <Input 
                    id="firstName" 
                    defaultValue={user?.name || ""}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Soyad</Label>
                  <Input 
                    id="lastName" 
                    defaultValue={user?.surname || ""}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-infoline-dark-gray" />
                    <Input 
                      id="email" 
                      type="email" 
                      className="pl-9"
                      defaultValue={user?.email || ""}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-infoline-dark-gray" />
                    <Input 
                      id="phone" 
                      type="tel" 
                      className="pl-9"
                      defaultValue="+994 50 123 45 67"
                    />
                  </div>
                </div>
              </div>
              
              {!isEditing && (
                <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Şifrə haqqında qeyd</p>
                    <p>İstifadəçi yaradıldıqdan sonra, sistem avtomatik olaraq təsadüfi şifrə yaradacaq və bu şifrə istifadəçinin e-poçt ünvanına göndəriləcək.</p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="role" className="mt-4 space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-infoline-dark-blue">İstifadəçi Rolu</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { id: "super-admin", label: "SuperAdmin", icon: Shield, description: "Sistemin bütün funksionallığına tam giriş" },
                    { id: "region-admin", label: "Region Admin", icon: Map, description: "Region daxilində tam idarəetmə" },
                    { id: "sector-admin", label: "Sektor Admin", icon: Building, description: "Sektor daxilində tam idarəetmə" },
                    { id: "school-admin", label: "Məktəb Admin", icon: School, description: "Məktəb üzrə idarəetmə" },
                  ].map((role) => {
                    const isSelected = selectedRole === role.id;
                    const Icon = role.icon;
                    
                    return (
                      <div 
                        key={role.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          isSelected 
                          ? "border-infoline-blue bg-infoline-blue/5 ring-1 ring-infoline-blue" 
                          : "hover:border-infoline-light-gray"
                        }`}
                        onClick={() => setSelectedRole(role.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-1.5 rounded-full ${isSelected ? "bg-infoline-blue text-white" : "bg-infoline-light-gray"}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          
                          {isSelected && (
                            <Check className="h-4 w-4 text-infoline-blue" />
                          )}
                        </div>
                        
                        <h5 className="font-medium text-infoline-dark-blue mb-1">{role.label}</h5>
                        <p className="text-xs text-infoline-dark-gray">{role.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium text-infoline-dark-blue">Əlaqəli Təşkilat</h4>
                
                {selectedRole === "region-admin" && (
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Select defaultValue={user?.entity === "Bakı regionu" ? "baku" : ""}>
                      <SelectTrigger id="region">
                        <SelectValue placeholder="Region seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baku">Bakı</SelectItem>
                        <SelectItem value="ganja">Gəncə</SelectItem>
                        <SelectItem value="sumgait">Sumqayıt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {selectedRole === "sector-admin" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="region-sector">Region</Label>
                      <Select>
                        <SelectTrigger id="region-sector">
                          <SelectValue placeholder="Region seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baku">Bakı</SelectItem>
                          <SelectItem value="ganja">Gəncə</SelectItem>
                          <SelectItem value="sumgait">Sumqayıt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sector">Sektor</Label>
                      <Select defaultValue={user?.entity === "Yasamal sektoru" ? "yasamal" : ""}>
                        <SelectTrigger id="sector">
                          <SelectValue placeholder="Sektor seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yasamal">Yasamal</SelectItem>
                          <SelectItem value="nasimi">Nəsimi</SelectItem>
                          <SelectItem value="sabail">Səbail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                {selectedRole === "school-admin" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="region-school">Region</Label>
                      <Select>
                        <SelectTrigger id="region-school">
                          <SelectValue placeholder="Region seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baku">Bakı</SelectItem>
                          <SelectItem value="ganja">Gəncə</SelectItem>
                          <SelectItem value="sumgait">Sumqayıt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sector-school">Sektor</Label>
                      <Select>
                        <SelectTrigger id="sector-school">
                          <SelectValue placeholder="Sektor seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yasamal">Yasamal</SelectItem>
                          <SelectItem value="nasimi">Nəsimi</SelectItem>
                          <SelectItem value="sabail">Səbail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="school">Məktəb</Label>
                      <Select defaultValue={user?.entity === "134 nömrəli məktəb" ? "school-134" : ""}>
                        <SelectTrigger id="school">
                          <SelectValue placeholder="Məktəb seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="school-45">45 nömrəli məktəb</SelectItem>
                          <SelectItem value="school-134">134 nömrəli məktəb</SelectItem>
                          <SelectItem value="school-220">220 nömrəli məktəb</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                {selectedRole === "super-admin" && (
                  <div className="bg-infoline-lightest-gray p-4 rounded-md">
                    <p className="text-sm text-infoline-dark-gray">SuperAdmin istifadəçilər bütün təşkilatlara çıxışa malikdirlər.</p>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium text-infoline-dark-blue">Hesab Parametrləri</h4>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h5 className="font-medium text-infoline-dark-blue">Hesabı aktiv et</h5>
                    <p className="text-sm text-infoline-dark-gray">İstifadəçi sistemə daxil ola bilər</p>
                  </div>
                  <Switch defaultChecked={user?.status === "active"} />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h5 className="font-medium text-infoline-dark-blue">İlk giriş zamanı şifrə dəyişmə</h5>
                    <p className="text-sm text-infoline-dark-gray">İlk giriş zamanı şifrə dəyişdirilməlidir</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                {isEditing && (
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h5 className="font-medium text-infoline-dark-blue">Şifrəni sıfırla</h5>
                      <p className="text-sm text-infoline-dark-gray">İstifadəçiyə şifrə sıfırlama linki göndərilir</p>
                    </div>
                    <Button variant="outline" size="sm">Şifrəni sıfırla</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="permissions" className="mt-4 space-y-4">
              <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2 mb-4">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p>Rol əsaslı icazələr avtomatik olaraq təyin edilir. Əlavə xüsusi icazələr təyin edə bilərsiniz.</p>
                </div>
              </div>
              
              {permissionGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-3">
                  <h4 className="font-medium text-infoline-dark-blue">{group.name}</h4>
                  
                  <div className="border rounded-md p-3 space-y-3">
                    {group.permissions.map((permission, index) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox id={permission.id} defaultChecked={group.name === "Hesabat İdarəetməsi" || index < 2} />
                        <Label htmlFor={permission.id} className="text-sm">
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Ləğv et
            </Button>
            <Button 
              type="submit" 
              className="bg-infoline-blue hover:bg-infoline-dark-blue"
            >
              {isEditing ? "Yadda saxla" : "Yarat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
