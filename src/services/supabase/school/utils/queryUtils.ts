
/**
 * Utility function to calculate completion rate for a school
 * This is a placeholder - in a real app this would query the data table
 * to calculate the actual completion rate based on submitted forms, etc.
 */
export const calculateCompletionRate = async (schoolId: string): Promise<number> => {
  // Placeholder calculation - in a real app this would be based on actual data
  const randomRate = Math.floor(Math.random() * 40) + 60; // Random number between 60-100
  return randomRate;
};

/**
 * Handle errors safely when working with school data
 */
export const handleSchoolQueryError = (error: any): void => {
  if (error instanceof Error) {
    console.error(`School query error: ${error.message}`);
    if (error.stack) {
      console.debug(error.stack);
    }
  } else {
    console.error('Unknown school query error:', error);
  }
};

/**
 * Extract school data from query results safely
 */
export const extractSchoolData = (data: any): any => {
  if (!data) return null;
  
  try {
    // Extract top-level properties
    const result = { ...data };
    
    // Handle nested objects safely
    if (data.school_types) {
      result.type = data.school_types.name;
      delete result.school_types;
    }
    
    if (data.regions) {
      result.region = data.regions.name;
      delete result.regions;
    }
    
    if (data.sectors) {
      result.sector = data.sectors.name;
      delete result.sectors;
    }
    
    return result;
  } catch (error) {
    handleSchoolQueryError(error);
    return data; // Return original data if extraction fails
  }
};
