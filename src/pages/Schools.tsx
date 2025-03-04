
import { useState, useEffect } from 'react';
import { Layout } from "@/components/layout/Layout";
import { SchoolsOverview } from "@/components/schools/SchoolsOverview";
import { Toaster } from "@/components/ui/toaster";

const Schools = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <Layout userRole="super-admin">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
        </div>
        <Toaster />
      </Layout>
    );
  }
  
  return (
    <Layout userRole="super-admin">
      <SchoolsOverview />
      <Toaster />
    </Layout>
  );
};

export default Schools;
