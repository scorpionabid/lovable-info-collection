
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface Region {
  id: string;
  name: string;
  description: string;
  sectorCount: number;
  schoolCount: number;
  completionRate: number;
  createdAt: string;
}

interface RegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  region?: Region;
}

export const RegionModal = ({ isOpen, onClose, mode, region }: RegionModalProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    name: region?.name || '',
    description: region?.description || '',
    adminId: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would typically send an API request to create/update the region
    console.log("Submitting region data:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-infoline-light-gray">
          <h2 className="text-xl font-semibold text-infoline-dark-blue">
            {mode === 'create' ? 'Yeni Region Yarat' : 'Regionu Redaktə Et'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="basic">Əsas Məlumatlar</TabsTrigger>
              <TabsTrigger value="admin">Region Admini</TabsTrigger>
              <TabsTrigger value="config">Konfiqurasiya</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Region adı *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Region adını daxil edin"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Təsvir</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Region haqqında qısa məlumat"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminSelect">Region Admini</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange('adminId', value)}
                    value={formData.adminId}
                  >
                    <SelectTrigger id="adminSelect">
                      <SelectValue placeholder="Region Admini seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Yeni admin yarat</SelectItem>
                      <SelectItem value="user1">Elşən Məmmədov</SelectItem>
                      <SelectItem value="user2">Aynur Əliyeva</SelectItem>
                      <SelectItem value="user3">Kamran Hüseynov</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.adminId === 'new' && (
                  <div className="space-y-4 border p-4 rounded-md border-infoline-light-gray mt-4">
                    <h3 className="font-medium text-infoline-dark-blue">Yeni Admin Yarat</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="adminName">Ad</Label>
                        <Input id="adminName" placeholder="Adı daxil edin" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adminSurname">Soyad</Label>
                        <Input id="adminSurname" placeholder="Soyadı daxil edin" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Email</Label>
                      <Input id="adminEmail" type="email" placeholder="Email ünvanını daxil edin" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="adminPhone">Telefon</Label>
                      <Input id="adminPhone" placeholder="Telefon nömrəsini daxil edin" />
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="config" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notificationLevel">Bildiriş səviyyəsi</Label>
                  <Select>
                    <SelectTrigger id="notificationLevel">
                      <SelectValue placeholder="Bildiriş səviyyəsini seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Yüksək</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="low">Aşağı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deadline">Son tarix</Label>
                  <Input id="deadline" type="date" />
                </div>
              </TabsContent>
              
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-infoline-light-gray">
                <Button type="button" variant="outline" onClick={onClose}>
                  Ləğv et
                </Button>
                <Button type="submit" className="bg-infoline-blue hover:bg-infoline-dark-blue">
                  {mode === 'create' ? 'Yarat' : 'Yadda saxla'}
                </Button>
              </div>
            </form>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
