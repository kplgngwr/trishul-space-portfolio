/**
 * Local copy of the email validation logic for use inside Vercel
 * serverless functions. Kept separate from src/shared/lib/validation.ts
 * because Vercel's Node builder does not bundle imports that reach
 * outside the api/ directory — it deploys api/contact.ts standalone,
 * so a relative import into src/ resolves at build time but 404s
 * (ERR_MODULE_NOT_FOUND) at runtime in production.
 */

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const trimmed = email.trim();
    return trimmed.length > 0 && trimmed.length <= 254 && EMAIL_REGEX.test(trimmed);
}
