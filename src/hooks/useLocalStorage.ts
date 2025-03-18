import { useState, useEffect } from 'react';

/**
 * Local Storage üçün hook
 * Məlumatları local storage-də saxlamaq və idarə etmək üçün istifadə olunur
 * 
 * @param key Local Storage açarı
 * @param initialValue İlkin dəyər
 * @returns [dəyər, dəyəri dəyişmək üçün funksiya]
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Local Storage-dən dəyəri oxumaq üçün state
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Local Storage-dən dəyəri oxu
      const item = window.localStorage.getItem(key);
      // Əgər dəyər varsa, onu parse et, yoxdursa ilkin dəyəri qaytar
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });
  
  // Dəyəri yeniləmək üçün funksiya
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Əgər dəyər funksiya olarsa, onu çağır
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // State-i yenilə
      setStoredValue(valueToStore);
      // Local Storage-i yenilə
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };
  
  // Local Storage dəyişdikdə state-i yenilə
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing localStorage value:', error);
        }
      }
    };
    
    // Storage event dinləyicisini əlavə et
    window.addEventListener('storage', handleStorageChange);
    
    // Təmizləmə
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);
  
  return [storedValue, setValue];
}
