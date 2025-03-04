
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { User } from "@/services/api/userService";
import { UserFormValues } from "./UserFormSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface UserProfileTabProps {
  form: UseFormReturn<UserFormValues>;
  isEditing: boolean;
  user?: User;
  isCheckingUtisCode?: boolean;
}

export const UserProfileTab = ({ form, isEditing, user, isCheckingUtisCode }: UserProfileTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad</FormLabel>
              <FormControl>
                <Input placeholder="Ad daxil edin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Soyad</FormLabel>
              <FormControl>
                <Input placeholder="Soyad daxil edin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Email daxil edin" 
                  {...field} 
                  disabled={isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <Input placeholder="Telefon nömrəsi daxil edin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="utis_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UTIS Kodu</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="UTIS kodunu daxil edin" 
                    {...field} 
                    disabled={isEditing} 
                  />
                  {isCheckingUtisCode && (
                    <div className="absolute right-3 top-2">
                      <Loader2 className="h-5 w-5 animate-spin text-infoline-blue" />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!isEditing && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şifrə</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Şifrə daxil edin" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      
      <Separator />
    </div>
  );
};
