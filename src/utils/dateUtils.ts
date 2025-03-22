
/**
 * Tarix formatını azərbaycan dilinə uyğunlaşdırmaq və formatlamaq üçün funksiya
 * @param dateString - Formatlanacaq tarix string
 * @returns Formatlanmış tarix stringi
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
    console.error('Tarix formatlanarkən xəta baş verdi:', error);
    return dateString;
  }
}
