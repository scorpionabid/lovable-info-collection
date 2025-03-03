
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { SettingsOverview } from "@/components/settings/SettingsOverview";

const Settings = () => {
  const { user } = useAuth();
  
  return (
    <Layout userRole={user?.role}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-infoline-dark-blue">Parametrlər</h1>
        <p className="text-infoline-dark-gray mt-1">
          Sistem və istifadəçi parametrlərinin idarə edilməsi
        </p>
      </div>
      
      <SettingsOverview />
    </Layout>
  );
};

export default Settings;
