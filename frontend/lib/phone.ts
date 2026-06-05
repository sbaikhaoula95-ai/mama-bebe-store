export const MOROCCAN_PHONE_REGEX = /^0[67]\d{8}$/;

export function isValidMoroccanPhone(phone: string): boolean {
  return MOROCCAN_PHONE_REGEX.test(phone.trim());
}

export function formatPhoneForDisplay(phone: string): string {
  const cleaned = phone.replace(/\s/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}
