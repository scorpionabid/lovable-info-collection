
import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export const UserErrorState = ({ error, onRetry }: UserErrorStateProps) => {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-lg font-medium text-red-800 mb-2">Məlumatları yükləmək mümkün olmadı</h3>
      <p className="text-red-600">{error.message}</p>
      <Button 
        onClick={onRetry} 
        variant="outline" 
        className="mt-4 flex items-center gap-2"
      >
        <RefreshCw size={16} />
        <span>Yenidən cəhd et</span>
      </Button>
    </div>
  );
};
