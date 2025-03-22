
/**
 * Utility functions for the application
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind's merge utility
 * Used throughout the application for conditional styling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string into a localized format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('az', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Safely gets the role name from a user object, handling different role structures
 * @param roleValue - The role value from the user object
 * @returns The role name as a string
 */
export function getRoleName(roleValue: any): string {
  if (!roleValue) return '';
  
  if (typeof roleValue === 'object') {
    return roleValue.name || '';
  }
  
  return String(roleValue);
}

/**
 * Gets the display color for a role based on its name
 * @param roleName - The name of the role
 * @returns CSS classes for the role color
 */
export function getRoleColorClass(roleName: string): string {
  const role = roleName.toLowerCase();
  
  if (role.includes('super') || role.includes('superadmin')) {
    return 'bg-purple-100 text-purple-800';
  }
  
  if (role.includes('region')) {
    return 'bg-blue-100 text-blue-800';
  }
  
  if (role.includes('sector')) {
    return 'bg-green-100 text-green-800';
  }
  
  if (role.includes('school')) {
    return 'bg-yellow-100 text-yellow-800';
  }
  
  return 'bg-gray-100 text-gray-800';
}

/**
 * Parses the permissions from a role object or string
 * @param role - The role object or string
 * @returns Array of permission strings
 */
export function getRolePermissions(role: any): string[] {
  if (!role) return [];
  
  if (typeof role === 'object' && role.permissions) {
    if (Array.isArray(role.permissions)) {
      return role.permissions;
    }
    
    if (typeof role.permissions === 'string') {
      try {
        const parsed = JSON.parse(role.permissions);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [role.permissions];
      }
    }
  }
  
  return [];
}
