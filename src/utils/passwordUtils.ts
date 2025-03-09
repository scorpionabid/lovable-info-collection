
/**
 * Generates a random password that meets requirements:
 * - At least 8 characters
 * - Contains uppercase letters
 * - Contains lowercase letters
 * - Contains numbers
 * - Contains special characters
 */
export const generateRandomPassword = (length = 10): string => {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excluded O and I which can be confused
  const lowercase = 'abcdefghijkmnopqrstuvwxyz'; // Excluded l which can be confused
  const numbers = '23456789'; // Excluded 0 and 1 which can be confused
  const symbols = '!@#$%^&*()-_=+';
  const allChars = uppercase + lowercase + numbers + symbols;
  
  // Ensure at least one of each character type
  let password = 
    uppercase.charAt(Math.floor(Math.random() * uppercase.length)) +
    lowercase.charAt(Math.floor(Math.random() * lowercase.length)) +
    numbers.charAt(Math.floor(Math.random() * numbers.length)) +
    symbols.charAt(Math.floor(Math.random() * symbols.length));
    
  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

/**
 * Validates if a password meets requirements
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Şifrə ən azı 8 simvol olmalıdır' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Şifrədə ən azı bir böyük hərf olmalıdır' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Şifrədə ən azı bir kiçik hərf olmalıdır' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Şifrədə ən azı bir rəqəm olmalıdır' };
  }
  
  return { valid: true };
};
