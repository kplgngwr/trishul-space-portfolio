/**
 * Email Service Stubs
 * @description Placeholder implementations for form submissions
 * 
 * Replace these with actual API integrations when ready.
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

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

export function validateFile(file: File | null | undefined): string | null {
    if (!file) return 'Please select a file.';
    if (file.size > MAX_FILE_SIZE) return `File size must be less than 5MB.`;
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) return `Please upload PDF, DOC, or DOCX files only.`;
    return null;
}

// ============================================================================
// Stub Submission Functions (Console Log Only)
// ============================================================================

export async function submitContactForm(data: ContactFormData): Promise<SubmitResult> {
    console.log('[ContactForm] Submission:', data);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        success: true,
        message: 'Thank you! Your message has been received.',
    };
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
