
import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSchoolForm } from "./useSchoolForm";

export interface SchoolFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultRegionId?: string;
  defaultSectorId?: string;
}

export const SchoolForm: React.FC<SchoolFormProps> = ({ 
  mode, 
  initialData = {}, 
  onSuccess,
  onCancel,
  defaultRegionId,
  defaultSectorId
}) => {
  const {
    form,
    onSubmit,
    isLoading,
    regions,
    sectors,
    schoolTypes,
    handleRegionChange,
  } = useSchoolForm(mode === 'edit' ? initialData?.id : undefined, onSuccess);

  // Set default values when component mounts
  React.useEffect(() => {
    // If we have initialData, use it
    if (mode === 'edit' && initialData) {
      form.reset({
        name: initialData.name || '',
        sector_id: initialData.sector_id || '',
        region_id: initialData.region_id || '',
        type_id: initialData.type_id || '',
        code: initialData.code || '',
        address: initialData.address || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        director: initialData.director || '',
        student_count: initialData.student_count || 0,
        teacher_count: initialData.teacher_count || 0,
        status: initialData.status || 'Aktiv',
      });
    } 
    // If creating new and we have default IDs
    else if (mode === 'create') {
      if (defaultRegionId) {
        form.setValue('region_id', defaultRegionId);
        handleRegionChange(defaultRegionId);
      }
      if (defaultSectorId) {
        form.setValue('sector_id', defaultSectorId);
      }
    }
  }, [form, initialData, mode, defaultRegionId, defaultSectorId, handleRegionChange]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            name="region_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region *</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleRegionChange(value);
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
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

          <FormField
            control={form.control}
            name="type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Məktəb növü</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Status seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Aktiv">Aktiv</SelectItem>
                    <SelectItem value="Deaktiv">Deaktiv</SelectItem>
                  </SelectContent>
                </Select>
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

          <FormField
            control={form.control}
            name="director"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Direktor</FormLabel>
                <FormControl>
                  <Input placeholder="Direktor adını daxil edin" {...field} />
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
                <FormLabel>E-poçt</FormLabel>
                <FormControl>
                  <Input placeholder="E-poçt ünvanını daxil edin" {...field} />
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
                  <Input placeholder="Telefon nömrəsini daxil edin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="student_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şagird sayı</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Ləğv et
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Yüklənir..." : mode === 'create' ? "Yarat" : "Saxla"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
