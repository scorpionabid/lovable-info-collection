
import React from 'react';
import { Button } from "@/components/ui/button";
import { X, UserCheck, UserX, Trash2 } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onAction: (action: string) => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onClearSelection,
  onAction
}) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-medium text-blue-700">{selectedCount} istifadəçi seçilib</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearSelection}
          className="text-blue-700 hover:text-blue-900"
        >
          <X className="h-4 w-4 mr-1" />
          Təmizlə
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onAction('activate')}
          className="text-green-600 border-green-600 hover:bg-green-50"
        >
          <UserCheck className="h-4 w-4 mr-1" />
          Aktivləşdir
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onAction('deactivate')}
          className="text-orange-600 border-orange-600 hover:bg-orange-50"
        >
          <UserX className="h-4 w-4 mr-1" />
          Deaktivləşdir
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onAction('delete')}
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Sil
        </Button>
      </div>
    </div>
  );
};
