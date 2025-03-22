
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Control, Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectSectorProps {
  control: Control<any>;
  name: string;
  regionId?: string;
  error?: string;
  disabled?: boolean;
}

export const SelectSector = ({ control, name, regionId, error, disabled = false }: SelectSectorProps) => {
  const { data: sectors = [], isLoading } = useQuery({
    queryKey: ["sectors_dropdown", regionId],
    queryFn: async () => {
      if (!regionId) return [];

      const { data, error } = await supabase
        .from("sectors")
        .select("id, name")
        .eq("region_id", regionId)
        .order("name");

      if (error) throw error;
      return data || [];
    },
    enabled: !!regionId,
  });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div>
          <Select
            disabled={disabled || isLoading || !regionId}
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder="Sektor seçin" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sector) => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
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

export default SelectSector;
