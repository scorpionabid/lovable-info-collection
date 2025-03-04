
import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingIndicator = () => {
  return (
    <div className="flex justify-center py-4">
      <Loader2 className="h-6 w-6 animate-spin text-infoline-blue" />
    </div>
  );
};
