import * as z from "zod";

// Define reusable schema types
const id = z.string().uuid();

// Form validation schemas
const categorySchema = z.object({
  id: id.optional(),
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

const schoolSchema = z.object({
  id: id.optional(),
  name: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  address: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  region_id: id,
  sector_id: id,
  type_id: id,
  status: z.enum(["active", "inactive"]),
});

const regionSchema = z.object({
  id: id.optional(),
  name: z.string().min(2, {
    message: "Region name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

const sectorSchema = z.object({
  id: id.optional(),
  name: z.string().min(2, {
    message: "Sector name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  regionId: id,
});

const userSchema = z.object({
  id: id.optional(),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  role: z.string(),
  regionId: id.optional(),
  sectorId: id.optional(),
  schoolId: id.optional(),
  phone: z.string().optional(),
  is_active: z.boolean().default(true),
});

const dataEntrySchema = z.object({
  categoryId: id,
  schoolId: id,
  // Define fields dynamically based on category columns
});

// Fix the schemas with the proper type annotations
const schemas = {
  email: z.string().email().min(5),
  password: z.string().min(8),
  requiredString: z.string().min(1),
  optionalString: z.string().optional(),
  phone: z.string().regex(/^\+?[0-9\s-()]{8,15}$/).optional(),
  requiredNumber: z.number().min(0),
  optionalNumber: z.number().optional(),
  boolean: z.boolean().optional(),
  url: z.string().url().optional(),
  date: z.date().optional(),
  // Add any other schema types you need
};

// Utility functions for validation
const validateField = (schema: z.ZodTypeAny, value: any) => {
  try {
    schema.parse(value);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.errors[0]?.message || "Validation error" };
  }
};

const validateForm = (schema: z.ZodTypeAny, formData: any) => {
  try {
    schema.parse(formData);
    return { success: true, error: null };
  } catch (error: any) {
    const errors: Record<string, string> = {};
    error.errors.forEach((err: any) => {
      errors[err.path.join(".")] = err.message;
    });
    return { success: false, error: errors };
  }
};

// Export a properly typed version of validation functions
export { schemas, validateField, validateForm, categorySchema, schoolSchema, regionSchema, sectorSchema, userSchema, dataEntrySchema };

// Add CategoryColumn interface if it's missing
export interface CategoryColumn {
  id: string;
  name: string;
  description?: string;
  type: string;
  required: boolean;
  options?: string[];
  category_id: string;
  order: number;
}
