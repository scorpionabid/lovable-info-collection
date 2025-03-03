
import { Layout } from "@/components/layout/Layout";
import { SettingsOverview } from "@/components/settings/SettingsOverview";

const Settings = () => {
  return (
    <Layout userRole="super-admin">
      <SettingsOverview />
    </Layout>
  );
};

export default Settings;
