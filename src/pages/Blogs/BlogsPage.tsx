import { useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, ArrowRightIcon, CheckIcon } from '@/shared/ui';
import { useReducedMotion, EASE_OUT_EXPO, useNewsletterForm } from '@/shared/lib';
import { blogPosts } from '@/entities/blog';
import styles from './BlogsPage.module.css';

// ============================================================================
// Animation Variants (defined outside component to prevent recreation)
// ============================================================================

const CONTAINER_VARIANTS = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
} as const;

const CONTAINER_VARIANTS_REDUCED = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0 },
    },
} as const;

const CARD_VARIANTS = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: EASE_OUT_EXPO },
    },
} as const;

const CARD_VARIANTS_REDUCED = {
    hidden: { opacity: 0, y: 24 },
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
 * BlogsPage Component
 * @description Blog listing page with articles and newsletter signup
 */
export function BlogsPage(): ReactNode {
    const prefersReducedMotion = useReducedMotion();

    // Use custom hook for newsletter form - eliminates boilerplate
    const {
        email,
        isSubmitting,
        submitStatus,
        statusMessage,
        handleEmailChange,
        handleSubmit,
    } = useNewsletterForm('blogs_page');

    // Memoized animation variants
    const containerVariants = useMemo(
        () => prefersReducedMotion ? CONTAINER_VARIANTS_REDUCED : CONTAINER_VARIANTS,
        [prefersReducedMotion]
    );

    const cardVariants = useMemo(
        () => prefersReducedMotion ? CARD_VARIANTS_REDUCED : CARD_VARIANTS,
        [prefersReducedMotion]
    );

    const animDuration = prefersReducedMotion ? 0.01 : 0.5;

    return (
        <div className={styles.blogsPage}>
            <section className={styles.hero}>
                <motion.span className={styles.eyebrow} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: animDuration }}> Insights & Updates </motion.span>
                {/* <motion.h1 className={styles.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: animDuration, delay: 0.1 }} > Trishul Blog </motion.h1> */}

                <motion.p className={styles.subtitle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: animDuration, delay: 0.2 }}> 
                Stories from the frontier of Indian space technology — engineering insights, company updates, and industry perspectives.
                </motion.p>
            </section>

            {blogPosts.length === 0 ? (
                <div className={styles.emptyState}>
                    <h3 className={styles.emptyTitle}>No articles available</h3>
                    <p className={styles.emptyText}>Check back soon for new content.</p>
                </div>
            ) : (
                <motion.div
                    className={styles.blogGrid}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {blogPosts.map((post) => (
                        <motion.article
                            key={post.id}
                            className={styles.blogCard}
                            variants={cardVariants}
                        >
                            <Link
                                to={`/blogs/${post.id}`}
                                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                            >
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className={styles.image}
                                        loading="lazy"
                                    />
                                    <span className={styles.category}>{post.category}</span>
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.meta}>
                                        <span className={styles.date}>{post.date}</span>
                                        <span className={styles.readTime}>{post.readTime}</span>
                                    </div>
                                    <h2 className={styles.blogTitle}>{post.title}</h2>
                                    <p className={styles.excerpt}>{post.excerpt}</p>
                                    <span className={styles.readMore} aria-hidden="true">
                                        Read Article
                                        <ArrowRightIcon size={14} />
                                    </span>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </motion.div>
            )}

            <section className={styles.newsletter}>
                <h2 className={styles.newsletterTitle}>Stay in the Loop</h2>
                <p className={styles.newsletterText}>
                    Subscribe to our newsletter for the latest updates on our technology and journey.
                </p>

                {submitStatus === 'success' ? (
                    <div className={styles.successMessage} role="status">
                        <CheckIcon size={20} />
                        <span>{statusMessage}</span>
                    </div>
                ) : (
                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        {submitStatus === 'error' && (
                            <div className={styles.errorMessage} role="alert">
                                {statusMessage}
                            </div>
                        )}
                        <div className={styles.formRow}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={styles.emailInput}
                                aria-label="Email address for newsletter"
                                value={email}
                                onChange={handleEmailChange}
                                required
                                autoComplete="email"
                                maxLength={254}
                            />
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                            </Button>
                        </div>
                    </form>
                )}
            </section>
        </div>
    );
}
