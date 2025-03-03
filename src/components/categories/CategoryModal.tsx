import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { CategoryType } from './CategoryDetailView';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  category?: CategoryType;
}

export const CategoryModal = ({ isOpen, onClose, mode, category }: CategoryModalProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    assignment: category?.assignment || 'All',
    priority: category?.priority || 1,
    deadline: category?.deadline ? new Date(category.deadline).toISOString().split('T')[0] : '',
    status: category?.status === 'Active',
    notificationEnabled: true,
    reminderDays: 7,
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would typically send an API request to create/update the category
    console.log("Submitting category data:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-infoline-light-gray">
          <h2 className="text-xl font-semibold text-infoline-dark-blue">
            {mode === 'create' ? 'Yeni Kateqoriya Yarat' : 'Kateqoriyanı Redaktə Et'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="basic">Əsas Məlumatlar</TabsTrigger>
              <TabsTrigger value="deadline">Son Tarix</TabsTrigger>
              <TabsTrigger value="notifications">Bildirişlər</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Kateqoriya adı *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Kateqoriya adını daxil edin"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Təsvir</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Kateqoriya haqqında qısa məlumat"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignment">Təyinat *</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange('assignment', value)}
                    value={formData.assignment}
                  >
                    <SelectTrigger id="assignment">
                      <SelectValue placeholder="Təyinat seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Bütün məktəblər (All)</SelectItem>
                      <SelectItem value="Sectors">Yalnız sektorlar (Sectors)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioritet *</Label>
                  <Input
                    id="priority"
                    name="priority"
                    type="number"
                    min={1}
                    value={formData.priority}
                    onChange={handleChange}
                    placeholder="Prioritet daxil edin"
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="status">Kateqoriya statusu</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status"
                      checked={formData.status}
                      onCheckedChange={(checked) => handleSwitchChange('status', checked)}
                    />
                    <Label htmlFor="status" className="text-sm">
                      {formData.status ? 'Aktiv' : 'Deaktiv'}
                    </Label>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="deadline" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Son tarix *</Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="latePolicy">Gecikməyə dair siyasət</Label>
                  <Select>
                    <SelectTrigger id="latePolicy">
                      <SelectValue placeholder="Gecikməyə dair siyasət seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="allow">Gecikməyə icazə ver</SelectItem>
                      <SelectItem value="warning">Xəbərdarlıq göstər</SelectItem>
                      <SelectItem value="block">Məlumat daxiletməni blokla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="extensionPolicy">Uzadılma siyasəti</Label>
                  <Select>
                    <SelectTrigger id="extensionPolicy">
                      <SelectValue placeholder="Uzadılma siyasəti seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Avtomatik olaraq uzadıla bilər</SelectItem>
                      <SelectItem value="request">Sorğu əsasında uzadıla bilər</SelectItem>
                      <SelectItem value="none">Uzadılmaya icazə yoxdur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notificationEnabled">Bildirişlər</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="notificationEnabled"
                      checked={formData.notificationEnabled}
                      onCheckedChange={(checked) => handleSwitchChange('notificationEnabled', checked)}
                    />
                    <Label htmlFor="notificationEnabled" className="text-sm">
                      {formData.notificationEnabled ? 'Aktiv' : 'Deaktiv'}
                    </Label>
                  </div>
                </div>
                
                {formData.notificationEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="reminderDays">Xatırlatma günləri (son tarixdən əvvəl)</Label>
                      <Input
                        id="reminderDays"
                        name="reminderDays"
                        type="number"
                        min={1}
                        value={formData.reminderDays}
                        onChange={handleChange}
                        placeholder="Gün sayını daxil edin"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notificationType">Bildiriş növü</Label>
                      <Select>
                        <SelectTrigger id="notificationType">
                          <SelectValue placeholder="Bildiriş növünü seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Bütün bildirişlər</SelectItem>
                          <SelectItem value="email">Yalnız email</SelectItem>
                          <SelectItem value="system">Yalnız sistem bildirişləri</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notificationRecipients">Bildiriş alıcıları</Label>
                      <Select>
                        <SelectTrigger id="notificationRecipients">
                          <SelectValue placeholder="Bildiriş alıcılarını seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Bütün adminlər</SelectItem>
                          <SelectItem value="school">Yalnız SchoolAdmin</SelectItem>
                          <SelectItem value="sector">Yalnız SectorAdmin</SelectItem>
                          <SelectItem value="region">Yalnız RegionAdmin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
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
