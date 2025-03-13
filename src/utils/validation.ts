import { z } from 'zod';

interface CategoryColumn {
  id: string;
  name: string;
  type: string;
  required: boolean;
  options?: any;
  description?: string;
}

export const generateSchemaFromColumn = (column: any) => {
  const { 
    type, 
    required,
    min_value = null,
    max_value = null,
    regex_pattern = null,
    min_length = null,
    max_length = null,
    options = null
  } = column;

  let schema;

  switch (type) {
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

export const generateValidationSchema = (fields: any[]): z.ZodObject<any> => {
  const schemaObj: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case 'text':
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = fieldSchema.min(1, { message: `${field.name} alanı zorunludur` });
        } else {
          fieldSchema = fieldSchema.optional().or(z.literal(''));
        }
        break;

      case 'number':
        fieldSchema = z.number().or(z.string().transform((val) => Number(val) || 0));
        break;

      case 'email':
        fieldSchema = z.string().email();
        break;

      case 'date':
        fieldSchema = z.string().or(z.date());
        break;

      case 'select':
        if (field.options && Array.isArray(field.options)) {
          fieldSchema = z.string();
          if (field.required) {
            fieldSchema = fieldSchema.min(1, { message: `${field.name} seçilmelidir` });
          } else {
            fieldSchema = fieldSchema.optional().or(z.literal(''));
          }
        } else {
          fieldSchema = z.string().optional().or(z.literal(''));
        }
        break;

      default:
        fieldSchema = z.string().optional().or(z.literal(''));
    }

    schemaObj[field.id] = fieldSchema;
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
