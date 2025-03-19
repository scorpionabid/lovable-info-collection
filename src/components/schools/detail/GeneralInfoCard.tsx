
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { School } from "@/services/supabase/school/types";
import { User, MapPin, Phone, Mail, Award, UserPlus } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type User as UserType } from "@/services/userService/types";

interface GeneralInfoCardProps {
  school: School;
  isAssigning: boolean;
  onAssignAdmin: (userId: string) => void;
  admin?: UserType | null;
  isLoadingAdmin?: boolean;
}

export const GeneralInfoCard = ({ 
  school,
  isAssigning,
  onAssignAdmin,
  admin,
  isLoadingAdmin = false
}: GeneralInfoCardProps) => {
  const [selectedAdmin, setSelectedAdmin] = useState<string>("");
  const [availableAdmins, setAvailableAdmins] = useState<UserType[]>([]);
  
  return (
    <Card className="col-span-1 md:col-span-1 shadow-sm">
      <CardHeader>
        <CardTitle>Ümumi məlumat</CardTitle>
        <CardDescription>Məktəb haqqında ümumi məlumat</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="font-medium text-infoline-dark-gray mb-2">Əsas məlumatlar</div>
          <div className="space-y-2">
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-infoline-blue mr-2 mt-1" />
              <div>
                <div className="text-sm font-medium">Ünvan</div>
                <div className="text-sm text-infoline-dark-gray">{school.address || 'Təyin edilməyib'}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="w-4 h-4 text-infoline-blue mr-2 mt-1" />
              <div>
                <div className="text-sm font-medium">Əlaqə nömrəsi</div>
                <div className="text-sm text-infoline-dark-gray">{school.phone || school.contactPhone}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="w-4 h-4 text-infoline-blue mr-2 mt-1" />
              <div>
                <div className="text-sm font-medium">E-poçt</div>
                <div className="text-sm text-infoline-dark-gray">{school.email || school.contactEmail}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <Award className="w-4 h-4 text-infoline-blue mr-2 mt-1" />
              <div>
                <div className="text-sm font-medium">Status</div>
                <div className="text-sm text-infoline-dark-gray">{school.status}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <User className="w-4 h-4 text-infoline-blue mr-2 mt-1" />
              <div>
                <div className="text-sm font-medium">Direktor</div>
                <div className="text-sm text-infoline-dark-gray">{school.director || 'Təyin edilməyib'}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="font-medium text-infoline-dark-gray mb-2">Admin</div>
          {isLoadingAdmin ? (
            <div className="flex items-center justify-center h-20">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-infoline-blue"></div>
            </div>
          ) : admin ? (
            <div className="bg-infoline-lightest-gray p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="bg-infoline-blue rounded-full p-1.5 mr-2">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="font-medium">{admin.first_name} {admin.last_name}</div>
              </div>
              <div className="text-sm text-infoline-dark-gray">{admin.email}</div>
            </div>
          ) : (
            <div className="bg-infoline-lightest-gray p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="bg-gray-300 rounded-full p-1.5 mr-2">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <div className="font-medium text-infoline-dark-gray">Admin təyin edilməyib</div>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => {}}>
                <UserPlus className="h-4 w-4 mr-2" />
                Admin təyin et
              </Button>
            </div>
          )}
          
          {isAssigning && (
            <div className="mt-4">
              <Select value={selectedAdmin} onValueChange={setSelectedAdmin}>
                <SelectTrigger>
                  <SelectValue placeholder="Admin seçin" />
                </SelectTrigger>
                <SelectContent>
                  {availableAdmins.map(admin => (
                    <SelectItem key={admin.id} value={admin.id}>
                      {admin.first_name} {admin.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex space-x-2 mt-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => {}}>
                  Ləğv et
                </Button>
                <Button size="sm" className="flex-1" onClick={() => onAssignAdmin(selectedAdmin)}>
                  Təyin et
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
