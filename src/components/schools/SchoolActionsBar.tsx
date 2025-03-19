
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Upload, BarChart, FileText } from "lucide-react";

interface SchoolActionsBarProps {
  school: any;
}

export const SchoolActionsBar: React.FC<SchoolActionsBarProps> = ({ school }) => {
  if (!school) return null;

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Button variant="outline" size="sm" className="flex items-center">
        <Download className="mr-2 h-4 w-4" />
        Məlumatları yüklə
      </Button>
      
      <Button variant="outline" size="sm" className="flex items-center">
        <Upload className="mr-2 h-4 w-4" />
        Məlumat yüklə
      </Button>
      
      <Button variant="outline" size="sm" className="flex items-center">
        <BarChart className="mr-2 h-4 w-4" />
        Statistika
      </Button>
      
      <Button variant="outline" size="sm" className="flex items-center">
        <FileText className="mr-2 h-4 w-4" />
        Hesabat
      </Button>
    </div>
  );
};
