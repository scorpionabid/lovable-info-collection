
import { z } from 'zod';

interface CategoryColumn {
  id: string;
  name: string;
  data_type: string;
  required: boolean;
  min_value?: number | null;
  max_value?: number | null;
  regex_pattern?: string | null;
  min_length?: number | null;
  max_length?: number | null;
  options?: string[] | null;
  category_id: string;
}

export const generateSchemaFromColumn = (column: any) => {
  const { 
    data_type, 
    required,
    min_value = null,
    max_value = null,
    regex_pattern = null,
    min_length = null,
    max_length = null,
    options = null
  } = column;

  let schema;

  switch (data_type) {
    case 'string':
      schema = z.string();
      if (min_length !== null) {
        schema = schema.min(min_length);
      }
      if (max_length !== null) {
        schema = schema.max(max_length);
      }
      if (regex_pattern) {
        const regexObj = new RegExp(regex_pattern);
        schema = schema.regex(regexObj);
      }
      break;
    case 'number':
      schema = z.number();
      if (min_value !== null) {
        schema = schema.min(min_value);
      }
      if (max_value !== null) {
        schema = schema.max(max_value);
      }
      break;
    case 'boolean':
      schema = z.boolean();
      break;
    case 'date':
      schema = z.string()
        .refine(val => !isNaN(Date.parse(val)), {
          message: "Invalid date format",
        });
      break;
    case 'enum':
      if (options && Array.isArray(options) && options.length > 0) {
        schema = z.enum(options as [string, ...string[]]);
      } else {
        schema = z.string();
      }
      break;
    default:
      schema = z.string();
  }

  return required ? schema : schema.optional().nullable();
};

export const generateValidationSchema = (columns: CategoryColumn[]) => {
  const schemaObj: Record<string, z.ZodTypeAny> = {};

  columns.forEach(column => {
    schemaObj[column.id] = generateSchemaFromColumn(column);
  });

  return z.object(schemaObj);
};

export const isValidNumber = (value: any): boolean => {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  return !isNaN(Number(value));
};

export const isValidDate = (value: any): boolean => {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  const date = new Date(value);
  return !isNaN(date.getTime());
};
