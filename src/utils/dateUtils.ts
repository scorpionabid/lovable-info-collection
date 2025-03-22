
import { format, parseISO, isValid } from 'date-fns';
import { az } from 'date-fns/locale';

/**
 * ISO formatında tarix stringini formatlanmış tarix mətninə çevirir
 * @param dateString ISO formatında tarix
 * @param formatString format şablonu (defolt: 'dd.MM.yyyy')
 * @returns formatlanmış tarix mətni və ya əgər səhv tarix formatıdırsa "-"
 */
export const formatDate = (
  dateString?: string | null,
  formatString: string = 'dd.MM.yyyy'
): string => {
  if (!dateString) return '-';
  
  try {
    const date = parseISO(dateString);
    
    if (!isValid(date)) {
      return '-';
    }
    
    return format(date, formatString, { locale: az });
  } catch (error) {
    console.error('Tarix formatlaşdırılarkən xəta:', error);
    return '-';
  }
};

/**
 * Tarixi yoxlayır və əgər keçmişdədirsə true qaytarır
 * @param dateString ISO formatında tarix
 * @returns boolean
 */
export const isDateInPast = (dateString?: string | null): boolean => {
  if (!dateString) return false;
  
  try {
    const date = parseISO(dateString);
    
    if (!isValid(date)) {
      return false;
    }
    
    return date < new Date();
  } catch (error) {
    return false;
  }
};

/**
 * Tarixi localize edir
 * @param dateString ISO formatında tarix
 * @returns localize edilmiş tarix və ya əgər səhv tarix formatıdırsa "-"
 */
export const formatDateToLocale = (
  dateString?: string | null
): string => {
  if (!dateString) return '-';
  
  try {
    const date = parseISO(dateString);
    
    if (!isValid(date)) {
      return '-';
    }
    
    return date.toLocaleDateString('az-AZ');
  } catch (error) {
    console.error('Tarix formatlaşdırılarkən xəta:', error);
    return '-';
  }
};

/**
 * Tarix və zamanı formatlaşdırır
 * @param dateString ISO formatında tarix
 * @returns formatlanmış tarix və zaman
 */
export const formatDateTime = (
  dateString?: string | null
): string => {
  if (!dateString) return '-';
  
  try {
    const date = parseISO(dateString);
    
    if (!isValid(date)) {
      return '-';
    }
    
    return format(date, 'dd.MM.yyyy HH:mm', { locale: az });
  } catch (error) {
    console.error('Tarix formatlaşdırılarkən xəta:', error);
    return '-';
  }
};
