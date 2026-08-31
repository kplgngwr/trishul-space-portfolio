/**
 * Email Service
 * @description Form submission handlers. Contact form is wired to the
 * /api/contact serverless function (Resend). Newsletter/job application
 * remain stub implementations pending their own integrations.
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

export interface JobApplicationData {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    portfolio: string;
    experience: string;
    coverLetter: string;
    resume: File;
    jobTitle: string;
    department: string;
}

// ============================================================================
// Validation Utilities
// ============================================================================

export { isValidEmail, isValidPhone } from './validation';

const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function validateFile(file: File | null | undefined): string | null {
    if (!file) return 'Please select a file.';
    if (file.size > MAX_FILE_SIZE) return `File size must be less than 5MB.`;
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) return `Please upload PDF, DOC, or DOCX files only.`;
    return null;
}

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

export async function submitJobApplication(data: JobApplicationData): Promise<SubmitResult> {
    console.log('[JobApplication] Submission:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
        success: true,
        message: "Application submitted successfully! We'll review it and get back to you soon.",
    };
}
