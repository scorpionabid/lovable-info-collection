
// Common validation patterns
export const PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^\+?[0-9]{10,15}$/,
  URL: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/
};

// Generic validation functions
export const validators = {
  required: (value: any): boolean => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },
  
  email: (value: string): boolean => {
    if (!value) return true; // Skip if empty (use required validator separately)
    return PATTERNS.EMAIL.test(value);
  },
  
  phone: (value: string): boolean => {
    if (!value) return true;
    return PATTERNS.PHONE.test(value);
  },
  
  url: (value: string): boolean => {
    if (!value) return true;
    return PATTERNS.URL.test(value);
  },
  
  minLength: (min: number) => (value: string): boolean => {
    if (!value) return true;
    return value.length >= min;
  },
  
  maxLength: (max: number) => (value: string): boolean => {
    if (!value) return true;
    return value.length <= max;
  },
  
  min: (min: number) => (value: number): boolean => {
    if (value === undefined || value === null) return true;
    return value >= min;
  },
  
  max: (max: number) => (value: number): boolean => {
    if (value === undefined || value === null) return true;
    return value <= max;
  },
  
  pattern: (pattern: RegExp) => (value: string): boolean => {
    if (!value) return true;
    return pattern.test(value);
  },
  
  oneOf: (options: any[]) => (value: any): boolean => {
    if (value === undefined || value === null) return true;
    return options.includes(value);
  }
};

// Validation types for specific entities
export const validateSchool = (school: any): string[] => {
  const errors: string[] = [];
  
  if (!validators.required(school.name)) {
    errors.push('School name is required');
  }
  
  if (!validators.required(school.region_id)) {
    errors.push('Region is required');
  }
  
  if (!validators.required(school.sector_id)) {
    errors.push('Sector is required');
  }
  
  if (school.email && !validators.email(school.email)) {
    errors.push('Invalid email format');
  }
  
  if (school.phone && !validators.phone(school.phone)) {
    errors.push('Invalid phone format');
  }
  
  return errors;
};

export const validateUser = (user: any): string[] => {
  const errors: string[] = [];
  
  if (!validators.required(user.email)) {
    errors.push('Email is required');
  } else if (!validators.email(user.email)) {
    errors.push('Invalid email format');
  }
  
  if (!validators.required(user.first_name)) {
    errors.push('First name is required');
  }
  
  if (!validators.required(user.last_name)) {
    errors.push('Last name is required');
  }
  
  if (!validators.required(user.role_id)) {
    errors.push('Role is required');
  }
  
  if (user.phone && !validators.phone(user.phone)) {
    errors.push('Invalid phone format');
  }
  
  return errors;
};

export const validateCategory = (category: any): string[] => {
  const errors: string[] = [];
  
  if (!validators.required(category.name)) {
    errors.push('Category name is required');
  }
  
  if (!validators.required(category.assignment)) {
    errors.push('Assignment type is required');
  }
  
  return errors;
};

export const validateColumn = (column: any): string[] => {
  const errors: string[] = [];
  
  if (!validators.required(column.name)) {
    errors.push('Column name is required');
  }
  
  if (!validators.required(column.type)) {
    errors.push('Column type is required');
  }
  
  if (column.type === 'select' && (!column.options || column.options.length === 0)) {
    errors.push('Select options are required for select type columns');
  }
  
  return errors;
};

// Data validation based on column definitions
export const validateData = (data: Record<string, any>, columns: any[]): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  columns.forEach(column => {
    const value = data[column.id];
    
    // Required validation
    if (column.is_required && !validators.required(value)) {
      errors[column.id] = `${column.name} is required`;
      return;
    }
    
    // Skip further validation if empty and not required
    if (value === undefined || value === null || value === '') {
      return;
    }
    
    // Type validation
    switch (column.type) {
      case 'number':
        if (isNaN(Number(value))) {
          errors[column.id] = `${column.name} must be a number`;
        } else {
          const numValue = Number(value);
          if (column.min_value !== undefined && numValue < column.min_value) {
            errors[column.id] = `${column.name} must be at least ${column.min_value}`;
          }
          if (column.max_value !== undefined && numValue > column.max_value) {
            errors[column.id] = `${column.name} must be at most ${column.max_value}`;
          }
        }
        break;
        
      case 'date':
        const dateObj = new Date(value);
        if (isNaN(dateObj.getTime())) {
          errors[column.id] = `${column.name} must be a valid date`;
        }
        break;
        
      case 'select':
        if (column.options && !column.options.includes(value)) {
          errors[column.id] = `${column.name} must be one of: ${column.options.join(', ')}`;
        }
        break;
        
      case 'text':
        if (column.regex_pattern) {
          const regex = new RegExp(column.regex_pattern);
          if (!regex.test(value)) {
            errors[column.id] = `${column.name} has an invalid format`;
          }
        }
        break;
    }
  });
  
  return errors;
};
