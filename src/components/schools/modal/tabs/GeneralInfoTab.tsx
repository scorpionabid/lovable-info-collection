
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { SchoolFormValues } from "../types";

interface GeneralInfoTabProps {
  form: UseFormReturn<SchoolFormValues>;
  regions: Array<{id: string, name: string}>;
  sectors: Array<{id: string, name: string}>;
  schoolTypes: Array<{id: string, name: string}>;
  watchedRegionId: string;
}

export const GeneralInfoTab = ({ form, regions, sectors, schoolTypes, watchedRegionId }: GeneralInfoTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Məktəb adı <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Məktəb adını daxil edin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Məktəb növü <span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Məktəb növünü seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schoolTypes.length > 0 ? (
                    schoolTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      Məlumat yüklənir...
                    </SelectItem>
                  )}
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
          name="regionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region <span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Region seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {regions.length > 0 ? (
                    regions.map(region => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      Məlumat yüklənir...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="sectorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sektor <span className="text-red-500">*</span></FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={!watchedRegionId || sectors.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sektor seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sectors.length > 0 ? (
                    sectors.map(sector => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      {watchedRegionId ? "Məlumat yüklənir..." : "Əvvəlcə region seçin"}
                    </SelectItem>
                  )}
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
          name="studentCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şagird sayı</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Şagird sayını daxil edin" 
                  {...field}
                  min={0}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="teacherCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Müəllim sayı</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Müəllim sayını daxil edin" 
                  {...field}
                  min={0}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ünvan</FormLabel>
            <FormControl>
              <Input placeholder="Məktəbin ünvanını daxil edin" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Əlaqə e-poçtu</FormLabel>
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
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Əlaqə telefonu</FormLabel>
              <FormControl>
                <Input placeholder="Telefon nömrəsini daxil edin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
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
    </div>
  );
};
