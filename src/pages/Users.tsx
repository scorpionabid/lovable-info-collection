
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { UsersOverview } from "@/components/users/UsersOverview";

const Users = () => {
  const { user } = useAuth();
  
  return (
    <Layout userRole={user?.role}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-infoline-dark-blue">İstifadəçilər</h1>
        <p className="text-infoline-dark-gray mt-1">Sistem istifadəçilərinin idarə edilməsi</p>
      </div>
      
      <UsersOverview />
    </Layout>
  );
};

export default Users;
