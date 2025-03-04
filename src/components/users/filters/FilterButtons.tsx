
import React from "react";
import { Button } from "@/components/ui/button";

interface FilterButtonsProps {
  onReset: () => void;
  onClose: () => void;
  onApply: () => void;
}

export const FilterButtons = ({ onReset, onClose, onApply }: FilterButtonsProps) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" onClick={onReset}>Sıfırla</Button>
      <Button variant="outline" onClick={onClose}>Ləğv et</Button>
      <Button className="bg-infoline-blue hover:bg-infoline-dark-blue" onClick={onApply}>Tətbiq et</Button>
    </div>
  );
};
