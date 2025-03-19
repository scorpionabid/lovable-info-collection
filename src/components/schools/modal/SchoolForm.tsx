
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type SchoolFormProps = {
  mode: 'create' | 'edit';
  initialData: any;
  onCancel: () => void;
  defaultRegionId?: string;
  defaultSectorId?: string;
  form: UseFormReturn<any>;
  isSubmitting: boolean;
  errorMessage?: string;
  regions: any[];
  sectors: any[];
  schoolTypes: any[];
  onRegionChange: (regionId: string) => void;
  onSubmit: (values: any) => void;
};

export const SchoolForm: React.FC<SchoolFormProps> = ({
  mode,
  initialData,
  onCancel,
  defaultRegionId,
  defaultSectorId,
  form,
  isSubmitting,
  errorMessage,
  regions,
  sectors,
  schoolTypes,
  onRegionChange,
  onSubmit
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Ümumi Məlumat</TabsTrigger>
            <TabsTrigger value="contact">Əlaqə Məlumatları</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 pt-4">
            {/* School Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Məktəb adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Məktəbin adını daxil edin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* School Code */}
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

            {/* Region Field */}
            <FormField
              control={form.control}
              name="region_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      onRegionChange(value);
                    }}
                    defaultValue={field.value || defaultRegionId}
                    value={field.value}
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

            {/* Sector Field */}
            <FormField
              control={form.control}
              name="sector_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sektor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || defaultSectorId}
                    value={field.value}
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

            {/* School Type */}
            <FormField
              control={form.control}
              name="type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Məktəb tipi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Məktəb tipini seçin" />
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

            {/* Student Count */}
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
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Teacher Count */}
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
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 pt-4">
            {/* Director */}
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

            {/* Address */}
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

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-poçt</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Məktəbin e-poçtunu daxil edin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="Məktəbin telefon nömrəsini daxil edin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Ləğv et
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Yüklənir..." : mode === 'create' ? "Yarat" : "Yadda saxla"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
