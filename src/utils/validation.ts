
// Import required libraries and types
import { z } from "zod";

// Category Column interface
interface CategoryColumn {
  id: string;
  name: string;
  description?: string;
  dataType: string;
  isRequired: boolean;
  order: number;
  options?: any[];
}

// Zod validation for numeric values
export const validateNumber = (value: any): boolean => {
  return !isNaN(Number(value)) && value !== null && value !== undefined && value !== "";
};

// Helper function to add validation to a Zod schema
export const addValidationRules = (schema: z.ZodTypeAny, rules: any) => {
  let updatedSchema = schema;
  
  if (rules.required) {
    updatedSchema = updatedSchema.refine((val) => val && val.trim() !== "", {
      message: rules.requiredMessage || "This field is required",
    });
  }

  if (rules.minLength !== undefined) {
    updatedSchema = updatedSchema.refine((val) => !val || val.length >= rules.minLength, {
      message: rules.minLengthMessage || `Minimum length is ${rules.minLength} characters`,
    });
  }

  if (rules.maxLength !== undefined) {
    updatedSchema = updatedSchema.refine((val) => !val || val.length <= rules.maxLength, {
      message: rules.maxLengthMessage || `Maximum length is ${rules.maxLength} characters`,
    });
  }

  if (rules.pattern) {
    updatedSchema = updatedSchema.refine((val) => !val || new RegExp(rules.pattern).test(val), {
      message: rules.patternMessage || "Invalid format",
    });
  }

  return updatedSchema;
};

// Create Zod schema for field based on column definition
export const createFieldSchema = (column: CategoryColumn) => {
  const { dataType, isRequired } = column;
  
  let schema = z.any();
  
  switch (dataType) {
    case "text":
    case "longtext":
    case "email":
    case "phone":
    case "date":
    case "select":
      schema = isRequired ? z.string().min(1, { message: "This field is required" }) : z.string().optional();
      break;
    case "number":
      schema = isRequired 
        ? z.string().refine(validateNumber, { message: "Must be a number" }) 
        : z.string().refine((val) => !val || validateNumber(val), { message: "Must be a number" }).optional();
      break;
    case "boolean":
      schema = z.boolean().optional();
      break;
    default:
      schema = isRequired ? z.string().min(1) : z.string().optional();
  }
  
  return schema;
};

// Create a full form schema based on all columns
export const createFormSchema = (columns: CategoryColumn[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};
  
  columns.forEach((column) => {
    shape[column.id] = createFieldSchema(column);
  });
  
  return z.object(shape);
};

// Get form default values from columns
export const getFormDefaultValues = (columns: CategoryColumn[]) => {
  const defaultValues: Record<string, any> = {};
  
  columns.forEach((column) => {
    const { id, dataType } = column;
    
    switch (dataType) {
      case "text":
      case "longtext":
      case "email":
      case "phone":
      case "date":
      case "select":
        defaultValues[id] = "";
        break;
      case "number":
        defaultValues[id] = "";
        break;
      case "boolean":
        defaultValues[id] = false;
        break;
      default:
        defaultValues[id] = "";
    }
  });
  
  return defaultValues;
};
