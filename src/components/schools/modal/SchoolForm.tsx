
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { School } from "@/services/supabase/school/types";

// Define the form schema
export const schoolFormSchema = z.object({
  name: z.string().min(3, { message: "Məktəb adı ən azı 3 simvol olmalıdır" }),
  region_id: z.string().optional(),
  sector_id: z.string().min(1, { message: "Sektor seçilməlidir" }),
  status: z.string().optional(),
  code: z.string().optional(),
  address: z.string().optional(),
  type_id: z.string().optional(),
  email: z.string().email({ message: "Düzgün email formatı daxil edin" }).optional().or(z.literal("")),
  phone: z.string().optional(),
  director: z.string().optional(),
  student_count: z.coerce.number().min(0).optional(),
  teacher_count: z.coerce.number().min(0).optional(),
});

export type SchoolFormValues = z.infer<typeof schoolFormSchema>;

export interface SchoolFormProps {
  mode: "create" | "edit";
  initialData?: School;
  onCancel: () => void;
  defaultRegionId?: string;
  defaultSectorId?: string;
  form?: any;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  regions?: { id: string; name: string }[];
  sectors?: { id: string; name: string }[];
  schoolTypes?: { id: string; name: string }[];
  onRegionChange?: (regionId: string) => void;
  handleSubmit?: (values: SchoolFormValues) => Promise<void>;
}

export const SchoolForm = ({
  mode,
  initialData,
  onCancel,
  defaultRegionId,
  defaultSectorId,
  form: externalForm,
  isSubmitting,
  errorMessage,
  regions = [],
  sectors = [],
  schoolTypes = [],
  onRegionChange,
  handleSubmit: externalSubmit
}: SchoolFormProps) => {
  // Create a local form if none is provided
  const internalForm = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      sector_id: initialData?.sector_id || defaultSectorId || "",
      region_id: initialData?.region_id || defaultRegionId || "",
      type_id: initialData?.type_id || "",
      code: initialData?.code || "",
      address: initialData?.address || "",
      email: initialData?.email || initialData?.contactEmail || "",
      status: initialData?.status || "Aktiv",
      phone: initialData?.phone || initialData?.contactPhone || "",
      director: initialData?.director || "",
      student_count: initialData?.student_count || initialData?.studentCount || 0,
      teacher_count: initialData?.teacher_count || initialData?.teacherCount || 0,
    }
  });

  // Use either the provided form or the internal one
  const form = externalForm || internalForm;

  // Create a local submit function if none is provided
  const localSubmit = async (values: SchoolFormValues) => {
    // In a real implementation, this would save to the database
    console.log("Submitting form with values:", values);
    // Would typically make an API call here
  };

  // Use either the provided submit function or the local one
  const onSubmit = externalSubmit || localSubmit;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Məktəb adı *</FormLabel>
              <FormControl>
                <Input placeholder="Məktəb adını daxil edin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="region_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (onRegionChange) {
                      onRegionChange(value);
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Region seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sector_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sektor *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sektor seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Məktəb növü</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Məktəb növünü seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {schoolTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Status seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Aktiv">Aktiv</SelectItem>
                    <SelectItem value="Qeyri-aktiv">Qeyri-aktiv</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Məktəb kodu</FormLabel>
                <FormControl>
                  <Input placeholder="Məktəb kodunu daxil edin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ünvan</FormLabel>
                <FormControl>
                  <Input placeholder="Ünvanı daxil edin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="director"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Direktor</FormLabel>
                <FormControl>
                  <Input placeholder="Direktorun adını daxil edin" {...field} />
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
                  <Input placeholder="Email daxil edin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="student_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şagird sayı</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Şagird sayını daxil edin" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teacher_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Müəllim sayı</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Müəllim sayını daxil edin" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {errorMessage && (
          <div className="text-red-500 bg-red-50 border border-red-200 p-3 rounded-md">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Ləğv et
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Yaradılır..." : "Yenilənir..."}
              </>
            ) : (
              mode === "create" ? "Yarat" : "Yadda saxla"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
