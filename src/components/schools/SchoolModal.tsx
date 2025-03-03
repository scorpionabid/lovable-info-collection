
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  school?: any; // This would typically have a more specific type
}

export const SchoolModal = ({ isOpen, onClose, mode, school }: SchoolModalProps) => {
  const [activeTab, setActiveTab] = useState('general');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would typically send an API request
    console.log('Form submitted');
    onClose();
  };
  
  const regions = [
    { id: '1', name: 'Bakı şəhəri' },
    { id: '2', name: 'Sumqayıt şəhəri' },
    { id: '3', name: 'Gəncə şəhəri' },
  ];
  
  const sectors = [
    { id: '1', regionId: '1', name: 'Nəsimi rayonu' },
    { id: '2', regionId: '1', name: 'Yasamal rayonu' },
    { id: '3', regionId: '1', name: 'Sabunçu rayonu' },
    { id: '4', regionId: '2', name: 'Mərkəz' },
    { id: '5', regionId: '3', name: 'Mərkəz' },
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Yeni Məktəb Yarat' : 'Məktəb Məlumatlarını Redaktə Et'}
          </DialogTitle>
          <DialogDescription>
            Zəhmət olmasa aşağıdakı formu doldurun. Bütün məcburi xanaları (*) doldurmağınız vacibdir.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="general">Ümumi Məlumatlar</TabsTrigger>
              <TabsTrigger value="director">Direktor Məlumatları</TabsTrigger>
              <TabsTrigger value="admin">Admin Təyini</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-infoline-dark-gray block">
                    Məktəb adı <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="Məktəb adını daxil edin" 
                    defaultValue={school?.name || ''} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-infoline-dark-gray block">
                    Məktəb növü <span className="text-red-500">*</span>
                  </label>
                  <Select defaultValue={school?.type || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Məktəb növünü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="middle">Orta məktəb</SelectItem>
                      <SelectItem value="high">Tam orta məktəb</SelectItem>
                      <SelectItem value="primary">İbtidai məktəb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-infoline-dark-gray block">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <Select defaultValue={school?.region || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Region seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-infoline-dark-gray block">
                    Sektor <span className="text-red-500">*</span>
                  </label>
                  <Select defaultValue={school?.sector || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sektor seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map(sector => (
                        <SelectItem key={sector.id} value={sector.id}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-infoline-dark-gray block">
                    Şagird sayı <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="number" 
                    placeholder="Şagird sayını daxil edin" 
                    defaultValue={school?.studentCount || ''} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-infoline-dark-gray block">
                    Müəllim sayı <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="number" 
                    placeholder="Müəllim sayını daxil edin" 
                    defaultValue={school?.teacherCount || ''} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-infoline-dark-gray block">
                  Ünvan <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="Məktəbin ünvanını daxil edin" 
                  defaultValue={school?.address || ''} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-infoline-dark-gray block">
                    Əlaqə e-poçtu <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="email" 
                    placeholder="E-poçt ünvanını daxil edin" 
                    defaultValue={school?.contactEmail || ''} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-infoline-dark-gray block">
                    Əlaqə telefonu <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="Telefon nömrəsini daxil edin" 
                    defaultValue={school?.contactPhone || ''} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-infoline-dark-gray block">
                  Status <span className="text-red-500">*</span>
                </label>
                <Select defaultValue={school?.status || 'active'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktiv</SelectItem>
                    <SelectItem value="inactive">Deaktiv</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="director" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-infoline-dark-gray block">
                    Direktorun adı <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="Adı daxil edin" 
                    defaultValue={school?.directorFirstName || ''} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-infoline-dark-gray block">
                    Direktorun soyadı <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="Soyadı daxil edin" 
                    defaultValue={school?.directorLastName || ''} 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-infoline-dark-gray block">
                    E-poçt <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="email" 
                    placeholder="E-poçt ünvanını daxil edin" 
                    defaultValue={school?.directorEmail || ''} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-infoline-dark-gray block">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="Telefon nömrəsini daxil edin" 
                    defaultValue={school?.directorPhone || ''} 
                    required 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-infoline-dark-gray block">
                  Admin seçin
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Mövcud istifadəçini seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">Əliyev Vüqar (vugara@infoline.az)</SelectItem>
                    <SelectItem value="user2">Məmmədov Elnur (elnurm@infoline.az)</SelectItem>
                    <SelectItem value="user3">Hüseynova Aysel (ayselh@infoline.az)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center">
                <div className="flex-grow border-t border-infoline-light-gray"></div>
                <span className="px-4 text-sm text-infoline-dark-gray">və ya</span>
                <div className="flex-grow border-t border-infoline-light-gray"></div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-infoline-dark-gray">Yeni admin yarat</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-infoline-dark-gray block">
                      Ad
                    </label>
                    <Input placeholder="Adı daxil edin" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-infoline-dark-gray block">
                      Soyad
                    </label>
                    <Input placeholder="Soyadı daxil edin" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-infoline-dark-gray block">
                      E-poçt
                    </label>
                    <Input type="email" placeholder="E-poçt ünvanını daxil edin" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-infoline-dark-gray block">
                      Telefon
                    </label>
                    <Input placeholder="Telefon nömrəsini daxil edin" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Ləğv et
            </Button>
            <Button type="submit" className="bg-infoline-blue hover:bg-infoline-dark-blue">
              {mode === 'create' ? 'Yarat' : 'Yadda saxla'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
