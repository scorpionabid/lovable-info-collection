
import React from 'react';
import { SchoolInfo } from './details/SchoolInfo';
import { SchoolStats } from './details/SchoolStats';
import { AdminInfo } from './details/AdminInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash, Users, FileText, Activity } from "lucide-react";
import { Link } from "react-router-dom";

// Define props interface
interface SchoolDetailViewProps {
  school: any;
  admin?: any;
  isLoading?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SchoolDetailView: React.FC<SchoolDetailViewProps> = ({
  school,
  admin,
  isLoading = false,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/schools">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/schools">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Məktəb tapılmadı</h1>
        </div>
        <p>Bu ID ilə məktəb mövcud deyil və ya silinib.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link to="/schools">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-infoline-dark-blue">{school.name}</h1>
            <p className="text-sm text-infoline-dark-gray">
              {school.region?.name} | {school.sector?.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit} className="h-9">
              <Edit className="h-4 w-4 mr-2" />
              Redaktə et
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete} className="h-9">
              <Trash className="h-4 w-4 mr-2" />
              Sil
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            <span>Ümumi məlumat</span>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            <span>Statistika</span>
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>Administrator</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-0">
          <SchoolInfo school={school} />
        </TabsContent>
        
        <TabsContent value="statistics" className="mt-0">
          <SchoolStats schoolData={school} />
        </TabsContent>
        
        <TabsContent value="admin" className="mt-0">
          <AdminInfo admin={admin} school={school} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchoolDetailView;
