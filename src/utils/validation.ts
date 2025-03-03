
import { ColumnData } from '@/services/api/categoryService';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export const validateFormData = (
  data: Record<string, any>,
  columns: ColumnData[]
): ValidationResult => {
  const errors: Record<string, string> = {};
  
  columns.forEach(column => {
    const value = data[column.id as string];
    const columnName = column.name;
    
    // Check required fields
    if (column.required && (value === undefined || value === null || value === '')) {
      errors[column.id as string] = `${columnName} is required`;
      return;
    }
    
    // Skip validation if value is empty and not required
    if (value === undefined || value === null || value === '') {
      return;
    }
    
    // Validate based on column type
    switch (column.type) {
      case 'text':
        if (column.validation?.minLength && String(value).length < column.validation.minLength) {
          errors[column.id as string] = `${columnName} must be at least ${column.validation.minLength} characters`;
        }
        if (column.validation?.maxLength && String(value).length > column.validation.maxLength) {
          errors[column.id as string] = `${columnName} cannot exceed ${column.validation.maxLength} characters`;
        }
        if (column.validation?.regex) {
          const regex = new RegExp(column.validation.regex);
          if (!regex.test(String(value))) {
            errors[column.id as string] = column.validation.message || `${columnName} format is invalid`;
          }
        }
        break;
        
      case 'number':
        if (isNaN(Number(value))) {
          errors[column.id as string] = `${columnName} must be a number`;
        } else {
          if (column.validation?.min !== undefined && Number(value) < column.validation.min) {
            errors[column.id as string] = `${columnName} must be at least ${column.validation.min}`;
          }
          if (column.validation?.max !== undefined && Number(value) > column.validation.max) {
            errors[column.id as string] = `${columnName} cannot exceed ${column.validation.max}`;
          }
        }
        break;
        
      case 'select':
        if (column.options && !column.options.includes(value)) {
          errors[column.id as string] = `${columnName} must be one of the available options`;
        }
        break;
    }
  });
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
