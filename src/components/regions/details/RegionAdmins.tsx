
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BarChart4, Plus } from "lucide-react";

export const RegionAdmins = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-infoline-dark-blue">Region Adminləri</h2>
        <Link to="/users">
          <Button className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Admin Əlavə Et
          </Button>
        </Link>
      </div>
      
      <div className="bg-infoline-lightest-gray rounded-lg p-6 text-center">
        <BarChart4 className="mx-auto h-16 w-16 text-infoline-gray mb-4" />
        <p className="text-infoline-dark-gray">Bu region üçün təyin edilmiş admin yoxdur</p>
        <Button className="mt-4">Admin Təyin Et</Button>
      </div>
    </div>
  );
};
