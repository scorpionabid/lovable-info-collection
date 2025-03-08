
/**
 * Utility functions for password management
 */

/**
 * Generates a random secure password
 * @returns A secure random password with at least one uppercase, lowercase, number, and special character
 */
export function generateRandomPassword(): string {
  const upperChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const specialChars = '!@#$%^&*';
  
  const getRandomChar = (charset: string) => charset.charAt(Math.floor(Math.random() * charset.length));
  
  // Ensure we have at least one of each required character type
  let password = 
    getRandomChar(upperChars) +
    getRandomChar(lowerChars) +
    getRandomChar(numbers) +
    getRandomChar(specialChars);
  
  // Add additional random characters to reach desired length (minimum 8)
  const allChars = upperChars + lowerChars + numbers + specialChars;
  while (password.length < 10) {
    password += getRandomChar(allChars);
  }
  
  // Shuffle the password to avoid predictable patterns
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

/**
 * Validates that a password meets security requirements
 * @param password The password to validate
 * @returns Boolean indicating if the password is valid
 */
export function validatePassword(password: string = ''): boolean {
  if (password.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}
