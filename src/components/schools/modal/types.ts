
import { z } from "zod";

// Define schema for form validation - updating to make type and status optional
export const schoolSchema = z.object({
  name: z.string().min(3, { message: "Məktəb adı ən azı 3 simvol olmalıdır" }),
  type: z.string().optional(), // Made optional
  code: z.string().optional(), // Added code field
  regionId: z.string({ required_error: "Region seçilməlidir" }),
  sectorId: z.string({ required_error: "Sektor seçilməlidir" }),
  studentCount: z.coerce.number().min(0, { message: "Şagird sayı mənfi ola bilməz" }).optional().default(0),
  teacherCount: z.coerce.number().min(0, { message: "Müəllim sayı mənfi ola bilməz" }).optional().default(0),
  address: z.string().optional().or(z.literal("")),
  contactEmail: z.string().email({ message: "Düzgün email formatı daxil edin" }).optional().or(z.literal("")),
  contactPhone: z.string().optional().or(z.literal("")),
  status: z.string().optional().default("Aktiv"), // Made optional
});

export type SchoolFormValues = z.infer<typeof schoolSchema>;

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  school?: any; // This would typically have a more specific type
  onSchoolCreated?: () => void;
  onSchoolUpdated?: () => void;
  initialData?: any; // Added to match RegionModal API
  onSuccess?: () => void; // Added to match RegionModal API
  regionId?: string; // Added for creating schools in a specific region
}
