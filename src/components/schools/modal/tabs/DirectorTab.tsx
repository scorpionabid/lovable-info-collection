
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SchoolFormValues } from "../types";

interface DirectorTabProps {
  form: UseFormReturn<SchoolFormValues>;
}

export const DirectorTab = ({ form }: DirectorTabProps) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-infoline-dark-gray mb-4">
        Bu bölmə isteğe bağlıdır. Məktəb direktoru haqqında məlumat varsa, daxil edin.
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="directorFirstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direktorun adı</FormLabel>
              <FormControl>
                <Input placeholder="Adı daxil edin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="directorLastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direktorun soyadı</FormLabel>
              <FormControl>
                <Input placeholder="Soyadı daxil edin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="directorEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-poçt</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="E-poçt ünvanını daxil edin" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="directorPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <Input placeholder="Telefon nömrəsini daxil edin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
