
import { Layout } from "@/components/layout/Layout";
import { RegionsOverview } from "@/components/regions/RegionsOverview";

const Regions = () => {
  return (
    <Layout userRole="super-admin">
      <RegionsOverview />
    </Layout>
  );
};

export default Regions;
