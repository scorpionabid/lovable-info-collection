
import React from "react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { School } from "@/services/supabase/school/types";
import { useToast } from "@/components/ui/use-toast";
import { createSchool, updateSchool } from "@/services/supabase/school/crudOperations";

// Validation schema
const schoolSchema = z.object({
  name: z.string().min(3, { message: "Ad ən azı 3 simvol olmalıdır" }),
  code: z.string().min(1, { message: "Kod tələb olunur" }),
  address: z.string().optional(),
  region_id: z.string().min(1, { message: "Region seçilməlidir" }),
  sector_id: z.string().min(1, { message: "Sektor seçilməlidir" }),
  type_id: z.string().optional(),
  director: z.string().optional(),
  email: z.string().email({ message: "Düzgün email daxil edin" }).optional().or(z.literal("")),
  phone: z.string().optional(),
  student_count: z.coerce.number().int().nonnegative().optional(),
  teacher_count: z.coerce.number().int().nonnegative().optional(),
});

type SchoolFormValues = z.infer<typeof schoolSchema>;

interface SchoolFormProps {
  initialData: School | null;
  onSuccess: () => void;
  onCancel: () => void;
  mode: "create" | "edit";
  regionId?: string;
}

const SchoolForm: React.FC<SchoolFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
  mode,
  regionId,
}) => {
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      address: initialData?.address || "",
      region_id: initialData?.region_id || regionId || "",
      sector_id: initialData?.sector_id || "",
      type_id: initialData?.type_id || "",
      director: initialData?.director || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      student_count: initialData?.student_count || 0,
      teacher_count: initialData?.teacher_count || 0,
    },
  });

  const onSubmit = async (values: SchoolFormValues) => {
    try {
      if (mode === "create") {
        await createSchool(values);
        toast({
          title: "Məktəb yaradıldı",
          description: "Məktəb uğurla əlavə edildi",
        });
      } else if (mode === "edit" && initialData?.id) {
        await updateSchool(initialData.id, values);
        toast({
          title: "Məktəb yeniləndi",
          description: "Məktəb məlumatları uğurla yeniləndi",
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving school:", error);
      toast({
        title: "Xəta",
        description: "Məktəb yadda saxlanarkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Məktəb adı</FormLabel>
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
              <FormLabel>Kod</FormLabel>
              <FormControl>
                <Input placeholder="Məktəb kodunu daxil edin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input placeholder="Telefon nömrəsi daxil edin" {...field} />
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
                  <Input type="number" min="0" {...field} />
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
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Ləğv et
          </Button>
          <Button type="submit">{mode === "create" ? "Yarat" : "Yenilə"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default SchoolForm;
