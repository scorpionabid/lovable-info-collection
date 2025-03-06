
import { Button } from "@/components/ui/button";

interface RegionTableEmptyStateProps {
  onRefresh: () => void;
  isError?: boolean;
}

export const RegionTableEmptyState = ({ 
  onRefresh, 
  isError = false 
}: RegionTableEmptyStateProps) => {
  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center h-64 flex flex-col items-center justify-center">
        <p className="text-infoline-dark-gray mb-4">Məlumatları yükləyərkən xəta baş verdi</p>
        <Button onClick={onRefresh}>Yenidən cəhd edin</Button>
      </div>
    );
  }
  
  return (
    <div className="py-12 text-center">
      <p className="text-infoline-dark-gray">Nəticə tapılmadı</p>
    </div>
  );
};
