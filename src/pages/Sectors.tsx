
import { Layout } from "@/components/layout/Layout";
import { SectorsOverview } from "@/components/sectors/SectorsOverview";

const Sectors = () => {
  return (
    <Layout userRole="super-admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-infoline-dark-blue">Sektorlar</h1>
        <p className="text-infoline-dark-gray mt-1">Sektorların idarə edilməsi</p>
      </div>
      
      <SectorsOverview />
    </Layout>
  );
};

export default Sectors;
