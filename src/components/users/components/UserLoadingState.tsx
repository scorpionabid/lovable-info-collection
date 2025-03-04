
import React from "react";
import { Loader2 } from "lucide-react";

export const UserLoadingState = () => {
  return (
    <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 text-infoline-blue animate-spin mb-2" />
        <p className="text-infoline-dark-gray">Məlumatlar yüklənir...</p>
      </div>
    </div>
  );
};
