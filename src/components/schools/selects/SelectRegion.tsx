
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Control, Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectRegionProps {
  control: Control<any>;
  name: string;
  error?: string;
  disabled?: boolean;
}

export const SelectRegion = ({ control, name, error, disabled = false }: SelectRegionProps) => {
  const { data: regions = [], isLoading } = useQuery({
    queryKey: ["regions_dropdown"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("regions")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return data || [];
    },
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
              <SelectValue placeholder="Region seçin" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
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

export default SelectRegion;
