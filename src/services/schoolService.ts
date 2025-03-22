
// Import və re-export src/lib/supabase/services/schools faylından
import {
  getSchools,
  getSchoolById,
  getSchoolWithAdmin,
  getSchoolsByRegionId,
  getSchoolsBySectorId,
  getSchoolTypes,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchoolsForDropdown
} from '@/lib/supabase/services/schools';

// Məktəb aktivliklərini simulyasiya etmək üçün funksiya
export const getSchoolActivities = async (schoolId: string) => {
  console.log(`Fetching activities for school: ${schoolId}`);
  // Gələcəkdə aktivlik datası qaytaracaq, indi dummy data qaytarırıq
  return [
    { 
      id: '1', 
      date: new Date().toISOString(), 
      action: 'Məlumatlar yeniləndi', 
      user: 'Admin User' 
    },
    { 
      id: '2', 
      date: new Date(Date.now() - 86400000).toISOString(), 
      action: 'Məktəb yaradıldı', 
      user: 'System' 
    }
  ];
};

export {
  getSchools,
  getSchoolById,
  getSchoolWithAdmin,
  getSchoolsByRegionId,
  getSchoolsBySectorId,
  getSchoolTypes,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchoolsForDropdown
};

// Default export üçün servis obyekti
const schoolService = {
  getSchools,
  getSchoolById,
  getSchoolWithAdmin,
  getSchoolsByRegionId,
  getSchoolsBySectorId,
  getSchoolTypes,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchoolsForDropdown,
  getSchoolActivities
};

export default schoolService;
