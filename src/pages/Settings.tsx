
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { RequirementsStatus } from '@/components/settings/RequirementsStatus';

const Settings = () => {
  const { user, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  
  // Settings state
  const [language, setLanguage] = useState<string>("az");
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  const handleSaveSettings = () => {
    toast.success("Parametrlər uğurla yadda saxlanıldı");
  };
  
  return (
    <Layout userRole={userRole}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-infoline-dark-blue">Parametrlər</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">Ümumi</TabsTrigger>
            <TabsTrigger value="notifications">Bildirişlər</TabsTrigger>
            <TabsTrigger value="account">Hesab</TabsTrigger>
            <TabsTrigger value="language">Dil</TabsTrigger>
            {userRole === 'super-admin' && (
              <>
                <TabsTrigger value="system">Sistem</TabsTrigger>
                <TabsTrigger value="requirements">Tələblər</TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ümumi Parametrlər</CardTitle>
                <CardDescription>
                  Tətbiqin ümumi parametrlərini təyin edin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode">Qaranlıq Rejim</Label>
                    <p className="text-sm text-gray-500">Tətbiqi qaranlıq rejimində işlədin</p>
                  </div>
                  <Switch 
                    id="darkMode" 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                  />
                </div>
                
                <Button className="mt-4" onClick={handleSaveSettings}>
                  Yadda Saxla
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bildiriş Parametrləri</CardTitle>
                <CardDescription>
                  Bildiriş ayarlarını necə və nə vaxt alacağınızı təyin edin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Bildirişləri</Label>
                    <p className="text-sm text-gray-500">Bildirişləri email vasitəsilə alın</p>
                  </div>
                  <Switch 
                    id="emailNotifications" 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Bildirişləri</Label>
                    <p className="text-sm text-gray-500">Brauzer bildirişlərini alın</p>
                  </div>
                  <Switch 
                    id="pushNotifications" 
                    checked={pushNotifications} 
                    onCheckedChange={setPushNotifications} 
                  />
                </div>
                
                <Button className="mt-4" onClick={handleSaveSettings}>
                  Yadda Saxla
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hesab Parametrləri</CardTitle>
                <CardDescription>
                  Hesab məlumatlarınızı və təhlükəsizlik ayarlarınızı idarə edin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm font-medium mt-1">{user?.email}</p>
                  </div>
                  
                  <div>
                    <Label>Ad və Soyad</Label>
                    <p className="text-sm font-medium mt-1">{user?.first_name} {user?.last_name}</p>
                  </div>
                  
                  <div>
                    <Label>Rol</Label>
                    <p className="text-sm font-medium mt-1">{userRole}</p>
                  </div>
                  
                  <Button variant="outline" className="mt-2">Şifrəni Dəyiş</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="language" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dil Parametrləri</CardTitle>
                <CardDescription>
                  İnterfeys dilini təyin edin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="language">İnterfeys Dili</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language" className="mt-1">
                        <SelectValue placeholder="Dil seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="az">Azərbaycan</SelectItem>
                        <SelectItem value="ru">Русский</SelectItem>
                        <SelectItem value="tr">Türkçe</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="mt-4" onClick={handleSaveSettings}>
                    Yadda Saxla
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {userRole === 'super-admin' && (
            <>
              <TabsContent value="system" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sistem Parametrləri</CardTitle>
                    <CardDescription>
                      Tətbiqin sistem parametrlərini konfiqurasiya edin
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="sessionTimeout">Sessiya Müddəti (dəqiqə)</Label>
                        <Select defaultValue="60">
                          <SelectTrigger id="sessionTimeout" className="mt-1">
                            <SelectValue placeholder="Müddət seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 dəqiqə</SelectItem>
                            <SelectItem value="30">30 dəqiqə</SelectItem>
                            <SelectItem value="60">1 saat</SelectItem>
                            <SelectItem value="120">2 saat</SelectItem>
                            <SelectItem value="240">4 saat</SelectItem>
                            <SelectItem value="480">8 saat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="maintenanceMode">Texniki Baxış Rejimi</Label>
                          <p className="text-sm text-gray-500">Sistem texniki baxış rejimində olacaq</p>
                        </div>
                        <Switch id="maintenanceMode" />
                      </div>
                      
                      <Button className="mt-4" onClick={handleSaveSettings}>
                        Yadda Saxla
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600">Təhlükəli Əməliyyatlar</CardTitle>
                    <CardDescription>
                      Bu əməliyyatlar dönməz dəyişikliklərə səbəb ola bilər
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="destructive">
                      Məlumatları Sıfırla
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="requirements">
                <RequirementsStatus />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
