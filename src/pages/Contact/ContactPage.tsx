import { useState, useCallback, useMemo, type ReactNode, type FormEvent, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Button, ArrowRightIcon, EmailIcon, PhoneIcon, LocationIcon, CheckIcon } from '@/shared/ui';
import {
    useReducedMotion,
    EASE_OUT_EXPO,
    submitContactForm,
    isValidEmail,
    type ContactFormData,
    type FormStatus,
    INITIAL_CONTACT_FORM_STATE,
} from '@/shared/lib';
import styles from './ContactPage.module.css';

// ============================================================================
// Animation Variants (defined outside component to prevent recreation)
// ============================================================================

const CONTAINER_VARIANTS = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
} as const;

const CONTAINER_VARIANTS_REDUCED = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0 },
    },
} as const;

const ITEM_VARIANTS = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: EASE_OUT_EXPO },
    },
} as const;

const ITEM_VARIANTS_REDUCED = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.01, ease: EASE_OUT_EXPO },
    },
} as const;

// ============================================================================
// Component
// ============================================================================

/**
 * ContactPage Component
 * @description Contact information and inquiry form with email submission
 */
export function ContactPage(): ReactNode {
    const prefersReducedMotion = useReducedMotion();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<FormStatus>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [formData, setFormData] = useState<ContactFormData>(INITIAL_CONTACT_FORM_STATE);

    // Memoized animation variants based on reduced motion preference
    const containerVariants = useMemo(
        () => prefersReducedMotion ? CONTAINER_VARIANTS_REDUCED : CONTAINER_VARIANTS,
        [prefersReducedMotion]
    );

    const itemVariants = useMemo(
        () => prefersReducedMotion ? ITEM_VARIANTS_REDUCED : ITEM_VARIANTS,
        [prefersReducedMotion]
    );

    // Memoized input handler with useCallback
    const handleInputChange = useCallback((
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (submitStatus === 'error') {
            setSubmitStatus('idle');
            setStatusMessage('');
        }
    }, [submitStatus]);

    // Memoized form submission handler
    const handleSubmit = useCallback(async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        // Client-side validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.subject || !formData.message.trim()) {
            setSubmitStatus('error');
            setStatusMessage('Please fill in all required fields.');
            return;
        }

        if (!isValidEmail(formData.email)) {
            setSubmitStatus('error');
            setStatusMessage('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        const result = await submitContactForm(formData);

        setIsSubmitting(false);
        setSubmitStatus(result.success ? 'success' : 'error');
        setStatusMessage(result.message);

        if (result.success) {
            setFormData(INITIAL_CONTACT_FORM_STATE);
        }
    }, [formData]);

    // Handler to reset form and try again
    const handleReset = useCallback((): void => {
        setSubmitStatus('idle');
    }, []);

    // Animation duration based on reduced motion
    const animDuration = prefersReducedMotion ? 0.01 : 0.5;

    return (
        <div className={styles.contactPage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <motion.span
                    className={styles.eyebrow}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: animDuration }}
                >
                    Get In Touch
                </motion.span>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: animDuration, delay: 0.1 }}
                >
                    Contact Us
                </motion.h1>
                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: animDuration, delay: 0.2 }}
                >
                    Partner with us to revolutionize India's space propulsion technology.
                    We're excited to hear from you.
                </motion.p>
            </section>

            {/* Contact Grid */}
            <motion.div
                className={styles.contactGrid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Contact Info Cards */}
                <motion.div className={styles.infoSection} variants={itemVariants}>
                    <h2 className={styles.sectionTitle}>Contact Information</h2>

                    <div className={styles.infoCards}>
                        {/* Address Card */}
                        <div className={styles.infoCard}>
                            <div className={styles.iconWrapper}>
                                <LocationIcon size={24} />
                            </div>
                            <div className={styles.infoContent}>
                                <h3 className={styles.infoLabel}>Office Location</h3>
                                <p className={styles.infoText}>
                                    3B/5F , Research and Innovation Park<br />
                                    Indian Institute of Technology Delhi<br />
                                    Hauz Khas, New Delhi – 110 016<br />
                                    INDIA
                                </p>
                                <a
                                    href="https://maps.app.goo.gl/tj25fvJ5WzS6RQMP9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.infoLink}
                                >
                                    View on Maps →
                                </a>
                            </div>
                        </div>

                        {/* Email Card */}
                        <div className={styles.infoCard}>
                            <div className={styles.iconWrapper}>
                                <EmailIcon size={24} />
                            </div>
                            <div className={styles.infoContent}>
                                <h3 className={styles.infoLabel}>Email</h3>
                                <a
                                    href="mailto:info@trishulspace.com"
                                    className={styles.infoText}
                                >
                                    info@trishulspace.com
                                </a>
                            </div>
                        </div>

                        {/* Phone Card */}
                        <div className={styles.infoCard}>
                            <div className={styles.iconWrapper}>
                                <PhoneIcon size={24} />
                            </div>
                            <div className={styles.infoContent}>
                                <h3 className={styles.infoLabel}>Phone</h3>
                                <a href="tel:+91 93106 23937" className={styles.infoText}>
                                    +91 93106 23937
                                </a>
                                {/* <p className={styles.infoHint}> Mon-Fri, 10:00 AM - 6:00 PM IST </p> */}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div className={styles.formSection} variants={itemVariants}>
                    <h2 className={styles.sectionTitle}>Send us a Message</h2>

                    {submitStatus === 'success' ? (
                        <div className={styles.successMessage}>
                            <div className={styles.successIcon}>
                                <CheckIcon size={32} />
                            </div>
                            <h3>Message Sent!</h3>
                            <p>{statusMessage}</p>
                            <Button variant="secondary" onClick={handleReset}>
                                Send Another Message
                            </Button>
                        </div>
                    ) : (
                        <form className={styles.form} onSubmit={handleSubmit} noValidate>
                            {submitStatus === 'error' && (
                                <div className={styles.errorMessage} role="alert">
                                    {statusMessage}
                                </div>
                            )}

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name" className={styles.label}>
                                        Full Name <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className={styles.input}
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        aria-required="true"
                                        autoComplete="name"
                                        maxLength={100}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="email" className={styles.label}>
                                        Email Address <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={styles.input}
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        aria-required="true"
                                        autoComplete="email"
                                        maxLength={254}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="organization" className={styles.label}>
                                    Organization (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="organization"
                                    name="organization"
                                    className={styles.input}
                                    placeholder="Your company or institution"
                                    value={formData.organization}
                                    onChange={handleInputChange}
                                    autoComplete="organization"
                                    maxLength={200}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="subject" className={styles.label}>
                                    Subject <span aria-hidden="true">*</span>
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    className={styles.select}
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                    aria-required="true"
                                >
                                    <option value="">Select a topic</option>
                                    <option value="Partnership Inquiry">Partnership Inquiry</option>
                                    <option value="Investment Opportunity">Investment Opportunity</option>
                                    <option value="Technical Inquiry">Technical Inquiry</option>
                                    <option value="Career Opportunities">Career Opportunities</option>
                                    <option value="Media & Press">Media & Press</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="message" className={styles.label}>
                                    Message <span aria-hidden="true">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className={styles.textarea}
                                    rows={5}
                                    placeholder="Tell us about your inquiry..."
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    aria-required="true"
                                    maxLength={5000}
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                icon={<ArrowRightIcon size={16} />}
                                className={styles.submitBtn}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    )}
                </motion.div>
            </motion.div>

            {/* Map Section */}
            <motion.section
                className={styles.mapSection}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.6, delay: 0.4 }}
            >
                <div className={styles.mapWrapper}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.869056462611!2d77.18798740583472!3d28.54365530125283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1d9a6426d987%3A0x48afdc51e54c8134!2sResearch%20and%20Innovation%20Park%20-%20IIT%20DELHI!5e0!3m2!1sen!2sin!4v1767743259432!5m2!1sen!2sin"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="IIT Delhi Research & Innovation Park Location"
                    />
                </div>
            </motion.section>
        </div>
    );
}
