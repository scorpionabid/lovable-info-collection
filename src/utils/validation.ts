import { z } from 'zod';

// Helper function for number validations
const applyNumberValidations = (schema: z.ZodNumber, validations: any) => {
  let updatedSchema = schema;
  
  if (validations.min !== undefined && typeof validations.min === 'number') {
    updatedSchema = updatedSchema.min(validations.min);
  }
  
  if (validations.max !== undefined && typeof validations.max === 'number') {
    updatedSchema = updatedSchema.max(validations.max);
  }
  
  return updatedSchema;
};

// Helper function for string validations
const applyStringValidations = (schema: z.ZodString, validations: any) => {
  let updatedSchema = schema;
  
  if (validations.min !== undefined && typeof validations.min === 'number') {
    updatedSchema = updatedSchema.min(validations.min);
  }
  
  if (validations.max !== undefined && typeof validations.max === 'number') {
    updatedSchema = updatedSchema.max(validations.max);
  }
  
  if (validations.regex !== undefined && validations.regex instanceof RegExp) {
    updatedSchema = updatedSchema.regex(validations.regex);
  }
  
  return updatedSchema;
};

// Helper function to create a schema based on column type
export const createSchemaForColumn = (column: any) => {
  if (!column || !column.type) {
    return z.any();
  }
  
  let schema;
  
  switch (column.type.toLowerCase()) {
    case 'text':
    case 'string':
      schema = z.string();
      if (column.validations) {
        schema = applyStringValidations(schema, column.validations);
      }
      break;
      
    case 'number':
    case 'integer':
      schema = z.number();
      if (column.validations) {
        schema = applyNumberValidations(schema, column.validations);
      }
      break;
      
    case 'boolean':
      schema = z.boolean();
      break;
      
    case 'date':
      schema = z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      });
      break;
      
    case 'select':
      schema = z.string();
      if (column.validations && column.validations.options) {
        schema = z.enum(column.validations.options);
      }
      break;
      
    default:
      schema = z.any();
  }
  
  // Handle required fields
  if (column.required) {
    return schema;
  } else {
    return schema.optional();
  }
};

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
