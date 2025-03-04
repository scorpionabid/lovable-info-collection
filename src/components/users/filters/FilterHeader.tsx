
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterHeaderProps {
  onClose: () => void;
}

export const FilterHeader = ({ onClose }: FilterHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-medium text-infoline-dark-blue">Ətraflı Filtrlər</h3>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
