
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const ConfigTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="approvals">Təsdiq tələb edilsin</Label>
            <p className="text-xs text-infoline-dark-gray">
              Məktəb və sektordan gələn məlumatların təsdiqi tələb edilsin
            </p>
          </div>
          <Switch id="approvals" defaultChecked />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="notifications">Bildirişlər</Label>
            <p className="text-xs text-infoline-dark-gray">
              Yeni məlumatlar barədə bildirişlər göndərilsin
            </p>
          </div>
          <Switch id="notifications" defaultChecked />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="reports">Avtomatik hesabatlar</Label>
            <p className="text-xs text-infoline-dark-gray">
              Həftəlik və aylıq hesabatlar avtomatik hazırlansın
            </p>
          </div>
          <Switch id="reports" />
        </div>
      </div>
    </div>
  );
};
