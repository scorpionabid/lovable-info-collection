
import React from "react";
import { Users as UsersIcon } from "lucide-react";

export const EmptyUserState = () => {
  return (
    <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col items-center text-center">
        <UsersIcon className="h-12 w-12 text-infoline-light-gray mb-3" />
        <h3 className="text-lg font-medium text-infoline-dark-blue mb-1">İstifadəçi tapılmadı</h3>
        <p className="text-infoline-dark-gray max-w-md">
          Axtarış meyarlarına uyğun heç bir istifadəçi tapılmadı. Başqa filtrlər sınayın və ya yeni istifadəçi əlavə edin.
        </p>
      </div>
    </div>
  );
};
