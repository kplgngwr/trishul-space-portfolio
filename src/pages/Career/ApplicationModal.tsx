import { useState, useCallback, useMemo, useEffect, useRef, type ReactNode, type FormEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon, ArrowRightIcon, CheckIcon } from '@/shared/ui';
import {
    useReducedMotion,
    submitJobApplication,
    isValidEmail,
    isValidPhone,
    validateFile,
    type FormStatus,
    INITIAL_APPLICATION_FORM_STATE,
    type ApplicationFormState,
} from '@/shared/lib';
import styles from './ApplicationModal.module.css';

// ============================================================================
// Types
// ============================================================================

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobTitle: string;
    department: string;
}

// ============================================================================
// Icon Components (memoized outside main component)
// ============================================================================

/**
 * UploadIcon Component
 */
function UploadIcon({ size = 24 }: { size?: number }): ReactNode {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
    );
}

/**
 * FileIcon Component
 */
function FileIcon({ size = 16 }: { size?: number }): ReactNode {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    );
}

// ============================================================================
// Animation Variants (defined outside component to prevent recreation)
// ============================================================================

const OVERLAY_VARIANTS = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
} as const;

const MODAL_VARIANTS = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
} as const;

// ============================================================================
// Component
// ============================================================================

/**
 * ApplicationModal Component
 * @description Modal form for job applications with resume upload and email submission
 */
export function ApplicationModal({
    isOpen,
    onClose,
    jobTitle,
    department,
}: ApplicationModalProps): ReactNode {
    const prefersReducedMotion = useReducedMotion();
    const modalRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<FormStatus>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [formData, setFormData] = useState<ApplicationFormState>(INITIAL_APPLICATION_FORM_STATE);

    // Memoized transition config
    const transitionConfig = useMemo(() => ({
        duration: prefersReducedMotion ? 0.01 : 0.3,
        ease: [0.16, 1, 0.3, 1] as const,
    }), [prefersReducedMotion]);

    // Focus trap and keyboard handler for accessibility
    useEffect(() => {
        if (!isOpen) return;

        const modal = modalRef.current;
        if (!modal) return;

        // Get all focusable elements inside the modal
        const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableElements = modal.querySelectorAll<HTMLElement>(focusableSelector);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus the first element when modal opens
        setTimeout(() => firstElement?.focus(), 100);

        const handleKeyDown = (e: KeyboardEvent): void => {
            // Close on Escape
            if (e.key === 'Escape') {
                onClose();
                return;
            }

            // Trap focus within modal
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Reset form to initial state
    const resetForm = useCallback((): void => {
        setFormData(INITIAL_APPLICATION_FORM_STATE);
        setResumeFile(null);
        setFileName(null);
        setSubmitStatus('idle');
        setStatusMessage('');
    }, []);

    // Handle input changes with error clearing
    const handleInputChange = useCallback((
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (submitStatus === 'error') {
            setSubmitStatus('idle');
            setStatusMessage('');
        }
    }, [submitStatus]);

    // Handle file selection with validation
    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file before accepting
        const validationError = validateFile(file);
        if (validationError) {
            setSubmitStatus('error');
            setStatusMessage(validationError);
            // Reset file input
            e.target.value = '';
            return;
        }

        setResumeFile(file);
        setFileName(file.name);

        // Clear any previous error
        if (submitStatus === 'error') {
            setSubmitStatus('idle');
            setStatusMessage('');
        }
    }, [submitStatus]);

    // Form submission with comprehensive validation
    const handleSubmit = useCallback(async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        // Validate required fields
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.experience.trim()) {
            setSubmitStatus('error');
            setStatusMessage('Please fill in all required fields.');
            return;
        }

        if (!isValidEmail(formData.email)) {
            setSubmitStatus('error');
            setStatusMessage('Please enter a valid email address.');
            return;
        }

        if (!isValidPhone(formData.phone)) {
            setSubmitStatus('error');
            setStatusMessage('Please enter a valid phone number.');
            return;
        }

        if (!resumeFile) {
            setSubmitStatus('error');
            setStatusMessage('Please upload your resume.');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        const result = await submitJobApplication({
            ...formData,
            resume: resumeFile,
            jobTitle,
            department,
        });

        setIsSubmitting(false);
        setSubmitStatus(result.success ? 'success' : 'error');
        setStatusMessage(result.message);
    }, [formData, resumeFile, jobTitle, department]);

    // Handle modal close with cleanup
    const handleClose = useCallback((): void => {
        resetForm();
        onClose();
    }, [resetForm, onClose]);

    // Handle overlay click (close on background click)
    const handleOverlayClick = useCallback((e: React.MouseEvent): void => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    }, [handleClose]);

    // Prevent click propagation from modal content
    const handleModalClick = useCallback((e: React.MouseEvent): void => {
        e.stopPropagation();
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.overlay}
                    onClick={handleOverlayClick}
                    variants={OVERLAY_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
                >
                    <motion.div
                        ref={modalRef}
                        className={styles.modal}
                        variants={MODAL_VARIANTS}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={transitionConfig}
                        onClick={handleModalClick}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <div className={styles.header}>
                            <div className={styles.headerContent}>
                                <h2 id="modal-title">Apply for Position</h2>
                                <p>
                                    {jobTitle} • {department}
                                </p>
                            </div>
                            <button
                                type="button"
                                className={styles.closeBtn}
                                onClick={handleClose}
                                aria-label="Close application form"
                            >
                                <CloseIcon size={20} />
                            </button>
                        </div>

                        {submitStatus === 'success' ? (
                            <div className={styles.successContainer}>
                                <div className={styles.successIcon}>
                                    <CheckIcon size={32} />
                                </div>
                                <h3>Application Submitted!</h3>
                                <p>{statusMessage}</p>
                                <button
                                    type="button"
                                    className={styles.closeSuccessBtn}
                                    onClick={handleClose}
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                                {submitStatus === 'error' && (
                                    <div className={styles.errorMessage} role="alert">
                                        {statusMessage}
                                    </div>
                                )}

                                <div className={styles.fieldGroup}>
                                    <label htmlFor="fullName" className={styles.label}>
                                        Full Name <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        className={styles.input}
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        aria-required="true"
                                        autoComplete="name"
                                        maxLength={100}
                                    />
                                </div>

                                <div className={styles.row}>
                                    <div className={styles.fieldGroup}>
                                        <label htmlFor="email" className={styles.label}>
                                            Email <span className={styles.required}>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className={styles.input}
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            aria-required="true"
                                            autoComplete="email"
                                            maxLength={254}
                                        />
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label htmlFor="phone" className={styles.label}>
                                            Phone <span className={styles.required}>*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            className={styles.input}
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            aria-required="true"
                                            autoComplete="tel"
                                            maxLength={20}
                                        />
                                    </div>
                                </div>

                                <div className={styles.row}>
                                    <div className={styles.fieldGroup}>
                                        <label htmlFor="linkedin" className={styles.label}>
                                            LinkedIn Profile
                                        </label>
                                        <input
                                            type="url"
                                            id="linkedin"
                                            name="linkedin"
                                            className={styles.input}
                                            placeholder="linkedin.com/in/..."
                                            value={formData.linkedin}
                                            onChange={handleInputChange}
                                            autoComplete="url"
                                            maxLength={200}
                                        />
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label htmlFor="portfolio" className={styles.label}>
                                            Portfolio / GitHub
                                        </label>
                                        <input
                                            type="url"
                                            id="portfolio"
                                            name="portfolio"
                                            className={styles.input}
                                            placeholder="github.com/..."
                                            value={formData.portfolio}
                                            onChange={handleInputChange}
                                            autoComplete="url"
                                            maxLength={200}
                                        />
                                    </div>
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label htmlFor="experience" className={styles.label}>
                                        Years of Experience <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="experience"
                                        name="experience"
                                        className={styles.input}
                                        placeholder="e.g., 3 years"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        required
                                        aria-required="true"
                                        maxLength={50}
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label htmlFor="resume" className={styles.label}>
                                        Resume / CV <span className={styles.required}>*</span>
                                    </label>
                                    <div
                                        className={`${styles.fileUpload} ${fileName ? styles.fileUploadActive : ''}`}
                                    >
                                        <input
                                            type="file"
                                            id="resume"
                                            name="resume"
                                            className={styles.fileInput}
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            required
                                            aria-required="true"
                                            aria-describedby="resume-hint"
                                        />
                                        {fileName ? (
                                            <div className={styles.fileName}>
                                                <FileIcon size={16} />
                                                <span>{fileName}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.uploadIcon}>
                                                    <UploadIcon size={24} />
                                                </div>
                                                <div className={styles.uploadText}>
                                                    <p>Click to upload or drag and drop</p>
                                                    <span id="resume-hint">PDF, DOC, or DOCX (Max 5MB)</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label htmlFor="coverLetter" className={styles.label}>
                                        Cover Letter / Message
                                    </label>
                                    <textarea
                                        id="coverLetter"
                                        name="coverLetter"
                                        className={styles.textarea}
                                        placeholder="Tell us why you're interested in this role..."
                                        value={formData.coverLetter}
                                        onChange={handleInputChange}
                                        maxLength={5000}
                                    />
                                </div>

                                <div className={styles.actions}>
                                    <button
                                        type="button"
                                        className={styles.cancelBtn}
                                        onClick={handleClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.submitBtn}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            'Submitting...'
                                        ) : (
                                            <>
                                                Submit Application
                                                <ArrowRightIcon size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
