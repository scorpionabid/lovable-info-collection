import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Define the SchoolFormValues schema
export const schoolFormSchema = z.object({
  name: z.string().min(3, { message: "Ad ən azı 3 simvol olmalıdır" }),
  region_id: z.string().min(1, { message: "Region seçilməlidir" }),
  sector_id: z.string().min(1, { message: "Sektor seçilməlidir" }),
  status: z.string().optional(),
  type_id: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email({ message: "Düzgün email formatı deyil" }).optional().or(z.literal('')),
  phone: z.string().optional(),
  student_count: z.preprocess(
    (val) => val === '' ? undefined : Number(val),
    z.number().nonnegative().optional()
  ),
  teacher_count: z.preprocess(
    (val) => val === '' ? undefined : Number(val),
    z.number().nonnegative().optional()
  ),
  director: z.string().optional()
});

// Export the SchoolFormValues type
export type SchoolFormValues = z.infer<typeof schoolFormSchema>;

// Define the SchoolFormProps interface
export interface SchoolFormProps {
  mode: 'create' | 'edit';
  initialData: any;
  onCancel: () => void;
  defaultRegionId?: string;
  defaultSectorId?: string;
  form: UseFormReturn<SchoolFormValues>;
  isSubmitting?: boolean;
  showSaveButton?: boolean;
  saveButtonText?: string;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  handleSubmit: (values: SchoolFormValues) => Promise<void>;
}

const SchoolForm = ({
  mode,
  initialData,
  onCancel,
  defaultRegionId,
  defaultSectorId,
  form,
  isSubmitting = false,
  showSaveButton = true,
  saveButtonText = 'Yadda saxla',
  showCancelButton = true,
  cancelButtonText = 'Ləğv et',
  handleSubmit
}: SchoolFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad</FormLabel>
              <FormControl>
                <Input placeholder="Məktəb adı" {...field} />
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
              <FormLabel>Region</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={defaultRegionId || initialData?.region_id}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Region seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Replace with actual regions data */}
                  <SelectItem value="region1">Region 1</SelectItem>
                  <SelectItem value="region2">Region 2</SelectItem>
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
              <FormLabel>Sektor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={defaultSectorId || initialData?.sector_id}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sektor seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Replace with actual sectors data */}
                  <SelectItem value="sector1">Sektor 1</SelectItem>
                  <SelectItem value="sector2">Sektor 2</SelectItem>
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
                <Textarea placeholder="Məktəb ünvanı" {...field} />
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
                <Input placeholder="Məktəb email" {...field} />
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
                <Input placeholder="Məktəb telefon" {...field} />
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
                <Input placeholder="Şagird sayı" type="number" {...field} />
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
                <Input placeholder="Müəllim sayı" type="number" {...field} />
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
                <Input placeholder="Direktor adı" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {showCancelButton && (
            <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
              {cancelButtonText}
            </Button>
          )}
          {showSaveButton && (
            <Button type="submit" disabled={isSubmitting}>
              {saveButtonText}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default SchoolForm;
