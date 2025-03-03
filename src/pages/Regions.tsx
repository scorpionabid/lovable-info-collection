
import { Layout } from "@/components/layout/Layout";
import { RegionsOverview } from "@/components/regions/RegionsOverview";

const Regions = () => {
  return (
    <Layout userRole="super-admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-infoline-dark-blue">Regionlar</h1>
        <p className="text-infoline-dark-gray mt-1">Regionların idarə edilməsi</p>
      </div>
      
      <RegionsOverview />
    </Layout>
  );
};

export default Regions;
