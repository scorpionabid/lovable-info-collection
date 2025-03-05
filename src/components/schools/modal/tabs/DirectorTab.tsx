
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="directorFirstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direktorun adı <span className="text-red-500">*</span></FormLabel>
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
              <FormLabel>Direktorun soyadı <span className="text-red-500">*</span></FormLabel>
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
              <FormLabel>E-poçt <span className="text-red-500">*</span></FormLabel>
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
              <FormLabel>Telefon <span className="text-red-500">*</span></FormLabel>
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
