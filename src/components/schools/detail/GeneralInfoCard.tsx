
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface SchoolGeneralInfoProps {
  school: {
    type: string;
    region: string;
    sector: string;
    studentCount: number;
    teacherCount: number;
    status: string;
    address: string;
    director?: string;
    contactEmail: string;
    contactPhone: string;
  };
  isAssigning: boolean;
  onAssignAdmin: (userId: string) => void;
}

export const GeneralInfoCard = ({
  school,
  isAssigning,
  onAssignAdmin
}: SchoolGeneralInfoProps) => {
  return (
    <Card className="p-6 col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-infoline-dark-blue mb-4">Ümumi Məlumatlar</h3>
          <dl className="space-y-3">
            <div className="grid grid-cols-3">
              <dt className="text-sm font-medium text-infoline-dark-gray">Növ:</dt>
              <dd className="text-sm text-infoline-dark-blue col-span-2">{school.type}</dd>
            </div>
            <div className="grid grid-cols-3">
              <dt className="text-sm font-medium text-infoline-dark-gray">Region:</dt>
              <dd className="text-sm text-infoline-dark-blue col-span-2">{school.region}</dd>
            </div>
            <div className="grid grid-cols-3">
              <dt className="text-sm font-medium text-infoline-dark-gray">Sektor:</dt>
              <dd className="text-sm text-infoline-dark-blue col-span-2">{school.sector}</dd>
            </div>
            <div className="grid grid-cols-3">
              <dt className="text-sm font-medium text-infoline-dark-gray">Şagird sayı:</dt>
              <dd className="text-sm text-infoline-dark-blue col-span-2">{school.studentCount}</dd>
            </div>
            <div className="grid grid-cols-3">
              <dt className="text-sm font-medium text-infoline-dark-gray">Müəllim sayı:</dt>
              <dd className="text-sm text-infoline-dark-blue col-span-2">{school.teacherCount}</dd>
            </div>
            <div className="grid grid-cols-3">
              <dt className="text-sm font-medium text-infoline-dark-gray">Status:</dt>
              <dd className="text-sm text-infoline-dark-blue col-span-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  school.status === 'Aktiv' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {school.status}
                </span>
              </dd>
            </div>
            <div className="grid grid-cols-3">
              <dt className="text-sm font-medium text-infoline-dark-gray">Ünvan:</dt>
              <dd className="text-sm text-infoline-dark-blue col-span-2">{school.address}</dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-infoline-dark-blue mb-4">Əlaqə Məlumatları</h3>
          <dl className="space-y-3">
            {school.director && (
              <div className="grid grid-cols-3">
                <dt className="text-sm font-medium text-infoline-dark-gray">Direktor:</dt>
                <dd className="text-sm text-infoline-dark-blue col-span-2">{school.director}</dd>
              </div>
            )}
            <div className="grid grid-cols-3">
              <dt className="text-sm font-medium text-infoline-dark-gray">E-poçt:</dt>
              <dd className="text-sm text-infoline-dark-blue col-span-2">{school.contactEmail}</dd>
            </div>
            <div className="grid grid-cols-3">
              <dt className="text-sm font-medium text-infoline-dark-gray">Telefon:</dt>
              <dd className="text-sm text-infoline-dark-blue col-span-2">{school.contactPhone}</dd>
            </div>
          </dl>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-infoline-dark-blue mb-2">Admins</h3>
            <p className="text-sm text-infoline-dark-gray mb-2">Məktəb adminlərini idarə edin</p>
            <div className="flex flex-col">
              <Button 
                className="mt-4"
                onClick={() => onAssignAdmin('placeholder-user-id')}
                disabled={isAssigning}
              >
                {isAssigning ? 'Gözləyin...' : 'Admin Təyin Et'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
