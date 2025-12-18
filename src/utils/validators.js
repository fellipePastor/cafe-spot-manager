const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email) => emailRegex.test(String(email).toLowerCase());

export const maskCnpj = (value) => {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 14);
  let masked = '';

  if (digits.length > 0) masked = digits.slice(0, 2);
  if (digits.length >= 3) masked += '.' + digits.slice(2, 5);
  if (digits.length >= 6) masked += '.' + digits.slice(5, 8);
  if (digits.length >= 9) masked += '/' + digits.slice(8, 12);
  if (digits.length >= 13) masked += '-' + digits.slice(12, 14);

  return masked;
};

export const isValidCnpj = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length === 14;
};

export const requiredFieldsFilled = (fields = []) => fields.every((f) => String(f || '').trim().length > 0);
