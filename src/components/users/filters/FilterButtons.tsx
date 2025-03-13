
import React from 'react';
import { Button } from "@/components/ui/button";
import { LoadingIndicator } from './LoadingIndicator';

export interface FilterButtonsProps {
  onApply: () => void;
  onReset: () => void;
  isLoading: boolean; // Add isLoading prop
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({ onApply, onReset, isLoading }) => {
  return (
    <div className="flex space-x-2 pt-4">
      <Button variant="outline" onClick={onReset} disabled={isLoading}>
        Reset
      </Button>
      <Button onClick={onApply} disabled={isLoading}>
        {isLoading ? <LoadingIndicator /> : 'Apply Filters'}
      </Button>
    </div>
  );
};
