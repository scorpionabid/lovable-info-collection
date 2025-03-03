
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings, Users, Database, Bell, ShieldCheck, Globe } from "lucide-react";

export const SettingsOverview = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-infoline-dark-blue">Parametrlər</h1>
          <p className="text-sm text-infoline-dark-gray mt-1">
            Sistem tənzimləmələri və konfiqurasiya
          </p>
        </div>
        <Button>
          Dəyişiklikləri Yadda Saxla
        </Button>
      </div>

      <Tabs defaultValue="system">
        <TabsList className="w-full bg-white border border-infoline-light-gray p-1 mb-6">
          <TabsTrigger 
            value="system" 
            className="flex items-center gap-2 text-sm px-4 py-2 data-[state=active]:bg-infoline-blue data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4" />
            Sistem Parametrləri
          </TabsTrigger>
          <TabsTrigger 
            value="users" 
            className="flex items-center gap-2 text-sm px-4 py-2 data-[state=active]:bg-infoline-blue data-[state=active]:text-white"
          >
            <Users className="h-4 w-4" />
            İstifadəçi Parametrləri
          </TabsTrigger>
          <TabsTrigger 
            value="data" 
            className="flex items-center gap-2 text-sm px-4 py-2 data-[state=active]:bg-infoline-blue data-[state=active]:text-white"
          >
            <Database className="h-4 w-4" />
            Məlumat Parametrləri
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="flex items-center gap-2 text-sm px-4 py-2 data-[state=active]:bg-infoline-blue data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4" />
            Bildiriş Parametrləri
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="flex items-center gap-2 text-sm px-4 py-2 data-[state=active]:bg-infoline-blue data-[state=active]:text-white"
          >
            <ShieldCheck className="h-4 w-4" />
            Təhlükəsizlik
          </TabsTrigger>
          <TabsTrigger 
            value="localization" 
            className="flex items-center gap-2 text-sm px-4 py-2 data-[state=active]:bg-infoline-blue data-[state=active]:text-white"
          >
            <Globe className="h-4 w-4" />
            Localization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
            <h2 className="text-xl font-semibold text-infoline-dark-blue mb-6">Sistem Parametrləri</h2>
            <p className="text-infoline-dark-gray">
              Parametrlər bölməsi hazırlanır və tezliklə istifadəyə veriləcək.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
            <h2 className="text-xl font-semibold text-infoline-dark-blue mb-6">İstifadəçi Parametrləri</h2>
            <p className="text-infoline-dark-gray">
              Parametrlər bölməsi hazırlanır və tezliklə istifadəyə veriləcək.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
            <h2 className="text-xl font-semibold text-infoline-dark-blue mb-6">Məlumat Parametrləri</h2>
            <p className="text-infoline-dark-gray">
              Parametrlər bölməsi hazırlanır və tezliklə istifadəyə veriləcək.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
            <h2 className="text-xl font-semibold text-infoline-dark-blue mb-6">Bildiriş Parametrləri</h2>
            <p className="text-infoline-dark-gray">
              Parametrlər bölməsi hazırlanır və tezliklə istifadəyə veriləcək.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
            <h2 className="text-xl font-semibold text-infoline-dark-blue mb-6">Təhlükəsizlik Parametrləri</h2>
            <p className="text-infoline-dark-gray">
              Parametrlər bölməsi hazırlanır və tezliklə istifadəyə veriləcək.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="localization" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
            <h2 className="text-xl font-semibold text-infoline-dark-blue mb-6">Localization Parametrləri</h2>
            <p className="text-infoline-dark-gray">
              Parametrlər bölməsi hazırlanır və tezliklə istifadəyə veriləcək.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
