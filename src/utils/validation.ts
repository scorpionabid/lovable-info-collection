
import { z } from 'zod';
import { CategoryColumn } from '@/services/supabase/category/types';

export type ExtendedColumnData = CategoryColumn & {
  type: string;
  required: boolean;
  options?: string[] | any;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
    options?: string[];
  };
};

export const createValidationSchema = (columns: ExtendedColumnData[]) => {
  const schema: Record<string, z.ZodTypeAny> = {};

  for (const column of columns) {
    let fieldSchema: z.ZodTypeAny;

    switch (column.type) {
      case 'text':
      case 'textarea': {
        fieldSchema = z.string();
        
        if (column.validation?.required) {
          fieldSchema = fieldSchema.min(1, { message: 'This field is required' });
        } else {
          fieldSchema = fieldSchema.optional();
        }
        
        if (column.validation?.minLength) {
          fieldSchema = z.string().min(column.validation.minLength);
        }
        
        if (column.validation?.maxLength) {
          fieldSchema = z.string().max(column.validation.maxLength);
        }
        
        if (column.validation?.pattern) {
          fieldSchema = z.string().regex(new RegExp(column.validation.pattern));
        }
        break;
      }
      case 'number': {
        fieldSchema = z.number();
        
        if (column.validation?.required) {
          fieldSchema = z.number();
        } else {
          fieldSchema = z.number().optional();
        }
        
        if (column.validation?.minValue !== undefined) {
          fieldSchema = z.number().min(column.validation.minValue);
        }
        
        if (column.validation?.maxValue !== undefined) {
          fieldSchema = z.number().max(column.validation.maxValue);
        }
        break;
      }
      case 'email': {
        fieldSchema = z.string().email();
        
        if (column.required) {
          fieldSchema = z.string().email();
        } else {
          fieldSchema = z.string().email().optional();
        }
        break;
      }
      case 'date': {
        fieldSchema = z.string();
        if (column.required) {
          fieldSchema = z.string().min(1);
        } else {
          fieldSchema = z.string().optional();
        }
        break;
      }
      case 'select': {
        if (column.options && Array.isArray(column.options)) {
          fieldSchema = z.enum(column.options as [string, ...string[]]);
        } else {
          fieldSchema = z.string();
        }
        
        if (!column.required) {
          fieldSchema = fieldSchema.optional();
        }
        break;
      }
      default: {
        fieldSchema = z.any();
        if (column.required) {
          fieldSchema = z.any();
        } else {
          fieldSchema = z.any().optional();
        }
      }
    }

    schema[column.name] = fieldSchema;
  }

  return z.object(schema);
};
