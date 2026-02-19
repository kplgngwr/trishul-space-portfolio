import { useMemo, type ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBlogPostById } from '@/entities/blog';
import { Button, ArrowLeftIcon, CheckIcon } from '@/shared/ui';
import { useReducedMotion, useNewsletterForm } from '@/shared/lib';
import styles from './BlogsPage.module.css';

/**
 * BlogPostPage Component
 * @description Individual blog post page with article content and newsletter subscription
 */
export function BlogPostPage(): ReactNode {
    const { id } = useParams<{ id: string }>();
    const prefersReducedMotion = useReducedMotion();

    // Use custom hook for newsletter form - eliminates boilerplate
    const {
        email,
        isSubmitting,
        submitStatus,
        statusMessage,
        handleEmailChange,
        handleSubmit,
    } = useNewsletterForm(`blog_post_${id}`);

    // O(1) lookup using Map instead of Array.find()
    const post = useMemo(() => getBlogPostById(id), [id]);

    // Handle post not found
    if (!post) {
        return (
            <div
                className={styles.blogsPage}
                style={{
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <h1 className={styles.headerTitle}>Post Not Found</h1>
                <p className={styles.footerText} style={{ marginBottom: '2rem' }}>
                    The blog post you're looking for doesn't exist.
                </p>
                <Link to="/blogs">
                    <Button variant="primary">Back to Blogs</Button>
                </Link>
            </div>
        );
    }

    const animDuration = prefersReducedMotion ? 0.01 : 0.5;

    return (
        <div className={styles.blogsPage}>
            <article className={styles.articleContainer}>
                <div className={styles.backLinkWrapper}>
                    <Link to="/blogs" className={styles.backLink}>
                        <ArrowLeftIcon size={16} />
                        Back to Blogs
                    </Link>
                </div>

                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: animDuration }}
                    className={styles.header}
                >
                    <div className={`${styles.meta} ${styles.headerMeta}`}>
                        <span className={`${styles.category} ${styles.headerCategory}`}>
                            {post.category}
                        </span>
                        <span className={styles.date}>{post.date}</span>
                        <span className={styles.readTime}>{post.readTime}</span>
                    </div>

                    <h1 className={styles.headerTitle}>{post.title}</h1>

                    <p className={styles.headerExcerpt}>
                        {post.excerpt}
                    </p>
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: animDuration, delay: 0.2 }}
                    className={`${styles.imageWrapper} ${styles.articleImageWrapper}`}
                >
                    <img
                        src={post.image}
                        alt={post.title}
                        className={styles.image}
                        loading="eager" // Above the fold, load immediately
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: animDuration, delay: 0.3 }}
                    className={styles.articleContent}
                >
                    {post.content.map((paragraph, index) => (
                        <p key={index} className={styles.paragraph}>
                            {paragraph}
                        </p>
                    ))}
                </motion.div>

                <section className={styles.footerSection} aria-labelledby="newsletter-heading">
                    <h3 id="newsletter-heading" className={styles.footerTitle}>
                        Enjoyed this article?
                    </h3>
                    <p className={styles.footerText}>
                        Subscribe to our newsletter for more updates.
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
            </article>
        </div>
    );
}
