
import { z } from "zod";

// Define the validation schema
export const userFormSchema = z.object({
  email: z.string().email({ message: "Düzgün email daxil edin" }),
  first_name: z.string().min(2, { message: "Ad ən azı 2 simvol olmalıdır" }),
  last_name: z.string().min(2, { message: "Soyad ən azı 2 simvol olmalıdır" }),
  phone: z.string().optional(),
  utis_code: z.string().min(5, { message: "UTIS kodu ən azı 5 simvol olmalıdır" })
    .max(20, { message: "UTIS kodu çox uzundur" })
    .regex(/^[A-Za-z0-9]+$/, { message: "UTIS kodu yalnız hərf və rəqəmlərdən ibarət olmalıdır" }),
  role_id: z.string({ required_error: "Rol seçin" }),
  region_id: z.string().optional(),
  sector_id: z.string().optional(),
  school_id: z.string().optional(),
  is_active: z.boolean().default(true),
  password: z.string().min(6, { message: "Şifrə ən azı 6 simvol olmalıdır" }).optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
