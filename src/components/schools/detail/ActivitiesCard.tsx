
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

interface ActivitiesCardProps {
  activities: Array<{
    title: string;
    date: string;
  }> | null;
}

export const ActivitiesCard = ({ activities }: ActivitiesCardProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-infoline-dark-blue mb-4">Son Fəaliyyətlər</h3>
      
      <div className="space-y-4">
        {activities && activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 border-b border-gray-100 pb-4">
              <div className="bg-infoline-lightest-blue p-2 rounded-full">
                <User className="w-5 h-5 text-infoline-blue" />
              </div>
              <div>
                <p className="text-sm font-medium text-infoline-dark-gray">{activity.title}</p>
                <p className="text-xs text-infoline-light-gray">{activity.date}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-infoline-dark-gray">Fəaliyyət tapılmadı</p>
        )}
      </div>
    </Card>
  );
};
