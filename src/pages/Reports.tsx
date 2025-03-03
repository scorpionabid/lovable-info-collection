
import { Layout } from "@/components/layout/Layout";
import { ReportsOverview } from "@/components/reports/ReportsOverview";

const Reports = () => {
  return (
    <Layout userRole="super-admin">
      <ReportsOverview />
    </Layout>
  );
};

export default Reports;
