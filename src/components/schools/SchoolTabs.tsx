
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SchoolTabsProps {
  school: any;
}

export const SchoolTabs: React.FC<SchoolTabsProps> = ({ school }) => {
  const [activeTab, setActiveTab] = useState("activities");

  if (!school) return null;

  return (
    <Tabs defaultValue="activities" onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="activities">Aktivliklər</TabsTrigger>
        <TabsTrigger value="categories">Kateqoriyalar</TabsTrigger>
        <TabsTrigger value="admins">Adminlər</TabsTrigger>
      </TabsList>
      
      <TabsContent value="activities">
        <Card>
          <CardHeader>
            <CardTitle>Son Aktivliklər</CardTitle>
          </CardHeader>
          <CardContent>
            {school.activities && school.activities.length > 0 ? (
              <ul className="space-y-4 divide-y">
                {school.activities.map((activity: any, index: number) => (
                  <li key={activity.id || index} className="pt-4 first:pt-0">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div>
                        <p className="font-medium">{activity.action || 'Aktivlik'}</p>
                        <p className="text-sm text-gray-500">{activity.details || 'Təfərrüatlar mövcud deyil'}</p>
                      </div>
                      <div className="text-sm text-gray-500 mt-1 sm:mt-0">
                        {new Date(activity.created_at || Date.now()).toLocaleString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-4">Heç bir aktivlik qeydə alınmayıb</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="categories">
        <Card>
          <CardHeader>
            <CardTitle>Kateqoriyalar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500 py-4">Kateqoriya məlumatları mövcud deyil</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="admins">
        <Card>
          <CardHeader>
            <CardTitle>Adminlər</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500 py-4">Admin məlumatları mövcud deyil</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
