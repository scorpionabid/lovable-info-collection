
import React from "react";
import { Loader2 } from "lucide-react";
import { User } from "@/services/supabase/user/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface UserProfileTabProps {
  isEditing: boolean;
  user?: User;
  isCheckingUtisCode?: boolean;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  utisCode: string;
  password?: string;
  onEmailChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onUtisCodeChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export const UserProfileTab = ({
  isEditing,
  isCheckingUtisCode,
  email,
  firstName,
  lastName,
  phone,
  utisCode,
  password = '',
  onEmailChange,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onUtisCodeChange,
  onPasswordChange
}: UserProfileTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first_name">Ad</Label>
          <Input 
            id="first_name"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            placeholder="Ad daxil edin"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">Soyad</Label>
          <Input 
            id="last_name"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            placeholder="Soyad daxil edin"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Email daxil edin"
            disabled={isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input 
            id="phone"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="Telefon nömrəsi daxil edin"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="utis_code">UTIS Kodu</Label>
          <div className="relative">
            <Input 
              id="utis_code"
              value={utisCode}
              onChange={(e) => onUtisCodeChange(e.target.value)}
              placeholder="UTIS kodunu daxil edin"
              disabled={isEditing}
            />
            {isCheckingUtisCode && (
              <div className="absolute right-3 top-2">
                <Loader2 className="h-5 w-5 animate-spin text-infoline-blue" />
              </div>
            )}
          </div>
        </div>
        
        {!isEditing && (
          <div className="space-y-2">
            <Label htmlFor="password">Şifrə</Label>
            <Input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Şifrə daxil edin"
            />
          </div>
        )}
      </div>
      
      <Separator />
    </div>
  );
};
