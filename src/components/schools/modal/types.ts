
import { z } from "zod";

// Define schema for form validation
export const schoolSchema = z.object({
  name: z.string().min(3, { message: "Məktəb adı ən azı 3 simvol olmalıdır" }),
  type: z.string({ required_error: "Məktəb növü seçilməlidir" }),
  regionId: z.string({ required_error: "Region seçilməlidir" }),
  sectorId: z.string({ required_error: "Sektor seçilməlidir" }),
  studentCount: z.coerce.number().min(0, { message: "Şagird sayı mənfi ola bilməz" }),
  teacherCount: z.coerce.number().min(0, { message: "Müəllim sayı mənfi ola bilməz" }),
  address: z.string().min(5, { message: "Ünvan ən azı 5 simvol olmalıdır" }),
  contactEmail: z.string().email({ message: "Düzgün email formatı daxil edin" }),
  contactPhone: z.string().min(5, { message: "Telefon nömrəsi ən azı 5 simvol olmalıdır" }),
  status: z.string().default("Aktiv"),
  directorFirstName: z.string().min(2, { message: "Ad ən azı 2 simvol olmalıdır" }),
  directorLastName: z.string().min(2, { message: "Soyad ən azı 2 simvol olmalıdır" }),
  directorEmail: z.string().email({ message: "Düzgün email formatı daxil edin" }),
  directorPhone: z.string().min(5, { message: "Telefon nömrəsi ən azı 5 simvol olmalıdır" }),
});

export type SchoolFormValues = z.infer<typeof schoolSchema>;

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  school?: any; // This would typically have a more specific type
  onSchoolCreated?: () => void;
  onSchoolUpdated?: () => void;
}
