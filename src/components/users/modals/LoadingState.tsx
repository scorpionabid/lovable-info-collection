
import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="flex justify-center py-6">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-infoline-blue mb-2" />
        <p className="text-sm text-infoline-dark-gray">Məlumatlar yüklənir...</p>
      </div>
    </div>
  );
};
