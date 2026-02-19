import { useState, useCallback, type FormEvent, type ChangeEvent } from 'react';
import { submitNewsletterSubscription, isValidEmail, type SubmitResult } from './emailService';

/**
 * Form submission status type
 */
export type FormStatus = 'idle' | 'success' | 'error';

/**
 * Newsletter form hook return type
 */
export interface UseNewsletterFormReturn {
    email: string;
    isSubmitting: boolean;
    submitStatus: FormStatus;
    statusMessage: string;
    handleEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent) => Promise<void>;
    resetForm: () => void;
}

/**
 * Custom hook for newsletter subscription form state management
 * Eliminates duplication between BlogsPage and BlogPostPage
 * 
 * @param source - Analytics source identifier (e.g., 'blogs_page', 'blog_post_xyz')
 * @returns Form state and handlers
 * 
 * @example
 * ```tsx
 * const { email, isSubmitting, submitStatus, statusMessage, handleEmailChange, handleSubmit } = useNewsletterForm('blogs_page');
 * ```
 */
export function useNewsletterForm(source: string): UseNewsletterFormReturn {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<FormStatus>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
        // Clear error when user starts typing
        if (submitStatus === 'error') {
            setSubmitStatus('idle');
            setStatusMessage('');
        }
    }, [submitStatus]);

    const handleSubmit = useCallback(async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        // Client-side validation before API call
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setSubmitStatus('error');
            setStatusMessage('Please enter your email address.');
            return;
        }

        if (!isValidEmail(trimmedEmail)) {
            setSubmitStatus('error');
            setStatusMessage('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        const result: SubmitResult = await submitNewsletterSubscription({
            email: trimmedEmail,
            source,
        });

        setIsSubmitting(false);
        setSubmitStatus(result.success ? 'success' : 'error');
        setStatusMessage(result.message);

        if (result.success) {
            setEmail('');
        }
    }, [email, source]);

    const resetForm = useCallback((): void => {
        setEmail('');
        setIsSubmitting(false);
        setSubmitStatus('idle');
        setStatusMessage('');
    }, []);

    return {
        email,
        isSubmitting,
        submitStatus,
        statusMessage,
        handleEmailChange,
        handleSubmit,
        resetForm,
    };
}

/**
 * Contact form state interface
 */
export interface ContactFormState {
    name: string;
    email: string;
    organization: string;
    subject: string;
    message: string;
}

/**
 * Initial state for contact form
 */
export const INITIAL_CONTACT_FORM_STATE: ContactFormState = {
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
} as const;

/**
 * Application form state interface
 */
export interface ApplicationFormState {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    portfolio: string;
    experience: string;
    coverLetter: string;
}

/**
 * Initial state for application form
 */
export const INITIAL_APPLICATION_FORM_STATE: ApplicationFormState = {
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    experience: '',
    coverLetter: '',
} as const;
