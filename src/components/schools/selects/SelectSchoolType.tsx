
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Control, Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectSchoolTypeProps {
  control: Control<any>;
  name: string;
  error?: string;
  disabled?: boolean;
}

export const SelectSchoolType = ({ control, name, error, disabled = false }: SelectSchoolTypeProps) => {
  const { data: schoolTypes = [], isLoading } = useQuery({
    queryKey: ["schoolTypes"],
    queryFn: async () => {
      try {
        // RPC funksiyası çağırarkən
        const { data, error } = await supabase.rpc("get_school_types");
        
        if (error) {
          console.error('Error fetching school types:', error);
          throw error;
        }
        
        if (!data || !Array.isArray(data)) {
          return [];
        }
        
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || ''
        }));
      } catch (error) {
        console.error("Error fetching school types:", error);
        return [];
      }
    }
  });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div>
          <Select
            disabled={disabled || isLoading}
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder="Məktəb tipi seçin" />
            </SelectTrigger>
            <SelectContent>
              {schoolTypes.map((type: any) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      )}
    />
  );
};

export default SelectSchoolType;
