/**
 * Generates a unique ID for employees and super employees
 * Format: [PREFIX][YYYY][MM][DD][RANDOM_STRING]
 * Example: EMP20250115A7B9C2D, SE20250115X3Y8Z1K
 */

export const generateUniqueId = (role: 'employee' | 'super-employee'): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Generate random alphanumeric string (8 characters)
  const randomString = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  // Determine prefix based on role
  const prefix = role === 'super-employee' ? 'SE' : 'EMP';
  
  // Combine all parts
  const uniqueId = `${prefix}${year}${month}${day}${randomString}`;
  
  return uniqueId;
};

/**
 * Validates if an ID follows the correct format
 */
export const validateIdFormat = (id: string, role: 'employee' | 'super-employee'): boolean => {
  const prefix = role === 'super-employee' ? 'SE' : 'EMP';
  const pattern = new RegExp(`^${prefix}\\d{8}[A-Z0-9]{8}$`);
  return pattern.test(id);
};

/**
 * Extracts creation date from ID
 */
export const extractDateFromId = (id: string): Date | null => {
  try {
    const year = parseInt(id.substring(2, 6));
    const month = parseInt(id.substring(6, 8)) - 1; // Month is 0-indexed
    const day = parseInt(id.substring(8, 10));
    return new Date(year, month, day);
  } catch {
    return null;
  }
};

