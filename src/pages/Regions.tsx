
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { RegionsOverview } from '@/components/regions/RegionsOverview';

const RegionsPage: React.FC = () => {
  return (
    <Layout>
      <RegionsOverview />
    </Layout>
  );
};

export default RegionsPage;
