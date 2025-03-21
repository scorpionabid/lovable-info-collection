
import React from 'react';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from 'react-hook-form';
import { type User } from '@/supabase/types';

interface PersonalTabProps {
  user?: User;
  isEditing?: boolean;
}

export const PersonalTab: React.FC<PersonalTabProps> = ({ user, isEditing = false }) => {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ad</FormLabel>
            <FormControl>
              <Input placeholder="Adı daxil edin" {...field} />
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
              <Input placeholder="Soyadı daxil edin" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
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
              <Input placeholder="Telefon nömrəsi" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="utis_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>UTİS Kodu</FormLabel>
            <FormControl>
              <Input placeholder="UTİS kodu daxil edin" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PersonalTab;
