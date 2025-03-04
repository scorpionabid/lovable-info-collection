
import React from "react";
import { Upload, Info, Mail, Phone } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserFormValues } from "./UserFormSchema";
import { User } from "@/services/api/userService";

interface UserProfileTabProps {
  form: UseFormReturn<UserFormValues>;
  isEditing: boolean;
  user?: User;
}

export const UserProfileTab = ({ form, isEditing, user }: UserProfileTabProps) => {
  const getInitials = (name: string, surname: string) => {
    return `${name?.charAt(0) || ""}${surname?.charAt(0) || ""}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4 mb-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src="" />
          <AvatarFallback className="bg-infoline-light-blue text-white text-xl">
            {isEditing 
              ? getInitials(user?.first_name || "", user?.last_name || "") 
              : form.getValues().first_name && form.getValues().last_name 
                ? getInitials(form.getValues().first_name, form.getValues().last_name)
                : "YI"
            }
          </AvatarFallback>
        </Avatar>
        
        <Button variant="outline" size="sm" className="flex items-center gap-1" type="button">
          <Upload className="h-4 w-4" />
          <span>Profil şəkli yüklə</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-infoline-dark-gray" />
                  <Input {...field} className="pl-9" type="email" />
                </div>
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
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-infoline-dark-gray" />
                  <Input {...field} className="pl-9" type="tel" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {!isEditing && (
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şifrə</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {!isEditing && (
        <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium">Şifrə haqqında qeyd</p>
            <p>İstifadəçi yaradıldıqdan sonra, ona təyin olunan şifrəni email vasitəsilə bildirmək lazımdır.</p>
          </div>
        </div>
      )}
    </div>
  );
};
