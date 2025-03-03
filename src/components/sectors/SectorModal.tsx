
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

interface Sector {
  id: string;
  name: string;
  description: string;
  regionId: string;
  regionName: string;
  schoolCount: number;
  completionRate: number;
  createdAt: string;
}

interface SectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  sector?: Sector;
}

export const SectorModal = ({ isOpen, onClose, mode, sector }: SectorModalProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    name: sector?.name || '',
    description: sector?.description || '',
    regionId: sector?.regionId || '',
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
    // This would typically send an API request to create/update the sector
    console.log("Submitting sector data:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-infoline-light-gray">
          <h2 className="text-xl font-semibold text-infoline-dark-blue">
            {mode === 'create' ? 'Yeni Sektor Yarat' : 'Sektoru Redaktə Et'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="basic">Əsas Məlumatlar</TabsTrigger>
              <TabsTrigger value="admin">Sektor Admini</TabsTrigger>
              <TabsTrigger value="config">Konfiqurasiya</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Sektor adı *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Sektor adını daxil edin"
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
                    placeholder="Sektor haqqında qısa məlumat"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="regionSelect">Region *</Label>
                  <Select
                    value={formData.regionId}
                    onValueChange={(value) => handleSelectChange('regionId', value)}
                    required
                  >
                    <SelectTrigger id="regionSelect">
                      <SelectValue placeholder="Region seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Bakı şəhəri</SelectItem>
                      <SelectItem value="2">Gəncə şəhəri</SelectItem>
                      <SelectItem value="3">Sumqayıt şəhəri</SelectItem>
                      <SelectItem value="4">Şəki rayonu</SelectItem>
                      <SelectItem value="5">Quba rayonu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminSelect">Sektor Admini</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange('adminId', value)}
                    value={formData.adminId}
                  >
                    <SelectTrigger id="adminSelect">
                      <SelectValue placeholder="Sektor Admini seçin" />
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
