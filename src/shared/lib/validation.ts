/**
 * Shared validation utilities.
 * Kept dependency-free (no Vite/browser APIs) so it can be imported both
 * from client code (src/**) and from Vercel serverless functions (api/**).
 */

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

export function isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const trimmed = email.trim();
    return trimmed.length > 0 && trimmed.length <= 254 && EMAIL_REGEX.test(trimmed);
}

export function isValidPhone(phone: string): boolean {
    if (!phone || typeof phone !== 'string') return false;
    const trimmed = phone.trim().replace(/\s/g, '');
    return trimmed.length >= 7 && trimmed.length <= 20 && PHONE_REGEX.test(trimmed);
}
