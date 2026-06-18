export function formatE164(phone: string): string {
  // Remove non-digit characters
  let digits = phone.replace(/\D/g, '');
  
  // Format to Indonesian standard (+62) if it starts with 0 or 62 or 8
  if (digits.startsWith('0')) {
    digits = '62' + digits.substring(1);
  } else if (digits.startsWith('8')) {
    digits = '62' + digits;
  }
  
  return `+${digits}`;
}
