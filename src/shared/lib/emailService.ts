/**
 * Email Service
 * @description Form submission handlers. Contact form is wired to the
 * /api/contact serverless function (Resend). Newsletter remains a stub
 * implementation pending its own integration. Job applications are handled
 * entirely by the hiring portal (see job.applyUrl on the Careers page).
 */

// ============================================================================
// Types
// ============================================================================

export interface SubmitResult {
    success: boolean;
    message: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    organization: string;
    subject: string;
    message: string;
}

export interface NewsletterData {
    email: string;
    source: string;
}

// ============================================================================
// Validation Utilities
// ============================================================================

export { isValidEmail } from './validation';

// ============================================================================
// Submission Functions
// ============================================================================

export async function submitContactForm(data: ContactFormData): Promise<SubmitResult> {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = (await response.json()) as SubmitResult;
        return result;
    } catch {
        return {
            success: false,
            message: 'Something went wrong. Please try again later.',
        };
    }
}

export async function submitNewsletterSubscription(data: NewsletterData): Promise<SubmitResult> {
    console.log('[Newsletter] Subscription:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        success: true,
        message: "You're subscribed! Thanks for joining our newsletter.",
    };
}

