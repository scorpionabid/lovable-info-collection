
import { z } from 'zod';
import { CategoryColumn } from '@/services/api/categoryService';

// Extended column data with validation properties
interface ExtendedColumnData extends CategoryColumn {
  type: string;
  required: boolean;
  options?: string[];
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

// Create validation schema based on column definitions
export const createValidationSchema = (columns: ExtendedColumnData[]) => {
  const schemaShape: Record<string, any> = {};

  columns.forEach(column => {
    let validator;

    if (column.type === 'text' || column.type === 'textarea') {
      validator = z.string();

      if (column.required) {
        validator = validator.min(1, { message: 'Bu sahə boş ola bilməz' });
      } else {
        validator = validator.optional();
      }

      if (column.validation?.minLength) {
        validator = validator.min(column.validation.minLength, { 
          message: `Minimum ${column.validation.minLength} simvol olmalıdır` 
        });
      }

      if (column.validation?.maxLength) {
        validator = validator.max(column.validation.maxLength, { 
          message: `Maksimum ${column.validation.maxLength} simvol ola bilər` 
        });
      }

      if (column.validation?.pattern) {
        validator = validator.regex(new RegExp(column.validation.pattern), { 
          message: 'Düzgün format daxil edin' 
        });
      }
    } else if (column.type === 'number') {
      validator = z.coerce.number();
      
      if (column.required) {
        validator = validator.min(0, { message: 'Bu sahə boş ola bilməz' });
      } else {
        validator = validator.optional();
      }

      if (column.validation?.minValue !== undefined) {
        validator = validator.min(column.validation.minValue, {
          message: `Minimum ${column.validation.minValue} olmalıdır`
        });
      }

      if (column.validation?.maxValue !== undefined) {
        validator = validator.max(column.validation.maxValue, {
          message: `Maksimum ${column.validation.maxValue} ola bilər`
        });
      }
    } else if (column.type === 'date') {
      validator = z.string();
      
      if (column.required) {
        validator = validator.min(1, { message: 'Tarix seçilməlidir' });
      } else {
        validator = validator.optional();
      }
    } else if (column.type === 'select') {
      validator = z.string();
      
      if (column.options && column.options.length > 0) {
        validator = z.enum(column.options as [string, ...string[]]);
      }
      
      if (column.required) {
        validator = validator.min(1, { message: 'Seçim edilməlidir' });
      } else {
        validator = validator.optional();
      }
    } else if (column.type === 'checkbox') {
      validator = z.boolean();
      
      if (column.required) {
        validator = validator.refine(val => val === true, {
          message: 'Bu sahə mütləq seçilməlidir',
        });
      }
    }

    schemaShape[column.name] = validator;
  });

  return z.object(schemaShape);
};
