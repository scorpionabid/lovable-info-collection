
import { z } from 'zod';
import * as categoryService from '@/services/api/categoryService';
import { ExtendedColumnData } from '@/services/supabase/category/types';

/**
 * Generates a Zod validation schema for a dynamic form based on column definitions
 * @param columns Array of column definitions with validation rules
 * @returns Zod schema object for form validation
 */
export const generateFormSchema = (columns: ExtendedColumnData[]) => {
  const schemaMap: Record<string, any> = {};

  columns.forEach(column => {
    let fieldSchema: z.ZodTypeAny;

    // Base type validation
    if (column.type === 'text' || column.type === 'textarea') {
      fieldSchema = z.string().trim();
    } else if (column.type === 'number') {
      fieldSchema = z.coerce.number();
    } else if (column.type === 'date') {
      fieldSchema = z.string().refine(val => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      });
    } else if (column.type === 'select' || column.type === 'radio') {
      fieldSchema = z.string();
      
      // Validate against options if provided
      if (column.options && Array.isArray(column.options) && column.options.length > 0) {
        fieldSchema = z.enum(column.options as [string, ...string[]]);
      }
    } else if (column.type === 'checkbox') {
      fieldSchema = z.boolean();
    } else if (column.type === 'file') {
      fieldSchema = z.any(); // File validation would be more complex
    } else if (column.type === 'email') {
      fieldSchema = z.string().email('Invalid email address');
    } else if (column.type === 'url') {
      fieldSchema = z.string().url('Invalid URL format');
    } else if (column.type === 'tel') {
      fieldSchema = z.string().regex(/^\+?[0-9\s-()]{7,}$/, 'Invalid phone number format');
    } else {
      // Default to string for unknown types
      fieldSchema = z.string();
    }

    // Apply additional validations based on column validation rules
    if (column.validation) {
      if (column.type === 'text' || column.type === 'textarea' || column.type === 'email' || column.type === 'url' || column.type === 'tel') {
        if (column.validation.minLength !== undefined) {
          fieldSchema = fieldSchema.min(column.validation.minLength, `Minimum ${column.validation.minLength} characters required`);
        }
        if (column.validation.maxLength !== undefined) {
          fieldSchema = fieldSchema.max(column.validation.maxLength, `Maximum ${column.validation.maxLength} characters allowed`);
        }
        if (column.validation.pattern) {
          fieldSchema = fieldSchema.regex(new RegExp(column.validation.pattern), 'Input does not match the required pattern');
        }
      } else if (column.type === 'number') {
        if (column.validation.minValue !== undefined) {
          fieldSchema = fieldSchema.min(column.validation.minValue, `Value must be at least ${column.validation.minValue}`);
        }
        if (column.validation.maxValue !== undefined) {
          fieldSchema = fieldSchema.max(column.validation.maxValue, `Value must be at most ${column.validation.maxValue}`);
        }
      }
    }

    // Make field optional or required
    if (column.required) {
      if (column.type === 'checkbox') {
        fieldSchema = fieldSchema.refine(val => val === true, {
          message: 'This field is required',
        });
      } else {
        fieldSchema = fieldSchema.refine(val => val !== undefined && val !== null && val !== '', {
          message: 'This field is required',
        });
      }
    } else {
      fieldSchema = fieldSchema.optional();
    }

    schemaMap[column.id] = fieldSchema;
  });

  return z.object(schemaMap);
};

/**
 * Validates data against the column definitions
 * @param data Form data to validate
 * @param columns Column definitions with validation rules
 * @returns Validation result object
 */
export const validateFormData = (data: Record<string, any>, columns: ExtendedColumnData[]) => {
  const schema = generateFormSchema(columns);
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Record<string, string> = {};
      error.errors.forEach(err => {
        const field = err.path[0].toString();
        formattedErrors[field] = err.message;
      });
      return { success: false, data: null, errors: formattedErrors };
    }
    return { success: false, data: null, errors: { _form: 'Validation failed' } };
  }
};
