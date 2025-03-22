
// Import və re-export src/lib/supabase/services/categories faylından
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryColumns
} from '@/lib/supabase/services/categories';

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryColumns
};

// Default export üçün servis obyekti
const categoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryColumns
};

export default categoryService;
