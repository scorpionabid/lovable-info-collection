
/**
 * Tip çevirmələr və xüsusi tip funksiyaları
 */

/**
 * "Type instantiation is excessively deep and possibly infinite" xətasını həll etmək üçün funksiya
 * Kompleks tip strukturlarını sadələşdirmək üçün istifadə olunur
 */
export function castType<T>(value: any): T {
  return value as unknown as T;
}

/**
 * JSON və string[] arasında tip çevirmə funksiyaları
 */
export function jsonToStringArray(json: any): string[] {
  if (!json) return [];
  if (Array.isArray(json)) return json as string[];
  if (typeof json === 'string') {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [json];
    }
  }
  return [];
}

/**
 * String massivini JSON formatına çevirmək
 */
export function stringArrayToJson(array: string[]): any {
  if (!array) return null;
  return array;
}

/**
 * PostgrestError xətalarını tip təhlükəsiz formatda qaytarır
 */
export function formatDatabaseError(error: any): { code: string; message: string; details: string } {
  if (!error) {
    return { code: 'UNKNOWN', message: 'Unknown error', details: '' };
  }
  
  return {
    code: error.code || 'UNKNOWN',
    message: error.message || 'Unknown database error',
    details: error.details || ''
  };
}

/**
 * SelectQueryError xətalarını obyektlərə əlavə edilə bilən formata çevirir
 */
export function handleSelectQueryError<T>(value: any, fallback: T): T {
  if (!value || typeof value === 'object' && 'error' in value) {
    return fallback;
  }
  return value as T;
}
