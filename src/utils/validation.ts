
import { z } from 'zod';
import { ColumnData } from '@/services/api/categoryService';

// Extend the ColumnData type to include validation
interface ExtendedColumnData extends ColumnData {
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
    options?: string[];
  };
}

export const validateDataField = (value: any, column: ExtendedColumnData) => {
  if (!column) return { valid: true };

  // Create a dynamic schema based on column type and validation rules
  let schema;

  if (column.type === 'string' || column.type === 'text') {
    schema = z.string();
    
    if (column.validation?.required || column.required) {
      schema = schema.min(1, { message: 'Bu sahə tələb olunur' });
    } else {
      schema = schema.optional();
    }
    
    if (column.validation?.minLength) {
      schema = schema.min(column.validation.minLength, { message: `Minimum ${column.validation.minLength} simvol olmalıdır` });
    }
    
    if (column.validation?.maxLength) {
      schema = schema.max(column.validation.maxLength, { message: `Maksimum ${column.validation.maxLength} simvol olmalıdır` });
    }
    
    if (column.validation?.pattern) {
      schema = schema.regex(new RegExp(column.validation.pattern), { message: 'Daxil etdiyiniz dəyər düzgün formatda deyil' });
    }
  } else if (column.type === 'number') {
    schema = z.number();
    
    if (column.validation?.required || column.required) {
      schema = schema;
    } else {
      schema = schema.optional();
    }
    
    if (column.validation?.minValue !== undefined) {
      schema = schema.min(column.validation.minValue, { message: `Minimum dəyər ${column.validation.minValue} olmalıdır` });
    }
    
    if (column.validation?.maxValue !== undefined) {
      schema = schema.max(column.validation.maxValue, { message: `Maksimum dəyər ${column.validation.maxValue} olmalıdır` });
    }
  } else if (column.type === 'date' || column.type === 'datetime') {
    schema = z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Düzgün tarix formatı deyil' });
    
    if (column.validation?.required || column.required) {
      schema = schema.min(1, { message: 'Bu sahə tələb olunur' });
    } else {
      schema = schema.optional();
    }
  } else if (column.type === 'boolean') {
    schema = z.boolean();
    
    if (!(column.validation?.required || column.required)) {
      schema = schema.optional();
    }
  } else if (column.type === 'select' || column.type === 'radio') {
    schema = z.string();
    
    if (column.validation?.options || column.options) {
      const options = column.validation?.options || column.options || [];
      schema = z.enum(options as [string, ...string[]]);
    }
    
    if (column.validation?.required || column.required) {
      schema = schema.min(1, { message: 'Bu sahə tələb olunur' });
    } else {
      schema = schema.optional();
    }
  } else {
    // Default to string validation if type is unknown
    schema = z.string();
    
    if (column.validation?.required || column.required) {
      schema = schema.min(1, { message: 'Bu sahə tələb olunur' });
    } else {
      schema = schema.optional();
    }
  }

  try {
    schema.parse(value);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Düzgün deyil' };
  }
};
