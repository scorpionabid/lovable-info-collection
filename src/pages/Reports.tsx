
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { ReportsOverview } from "@/components/reports/ReportsOverview";

const Reports = () => {
  const { user } = useAuth();
  
  return (
    <Layout userRole={user?.role}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-infoline-dark-blue">Hesabatlar</h1>
        <p className="text-infoline-dark-gray mt-1">
          Sistem üzrə analitik məlumatlar və hesabatlar
        </p>
      </div>
      
      <ReportsOverview />
    </Layout>
  );
};

export default Reports;
