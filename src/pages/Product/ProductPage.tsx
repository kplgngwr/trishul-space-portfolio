import { useState, useMemo, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/entities/product';
import { Button, ArrowRightIcon, CloseIcon, PlayIcon } from '@/shared/ui';
import { useReducedMotion, EASE_OUT_EXPO } from '@/shared/lib';
import styles from './ProductPage.module.css';

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

const CARD_VARIANTS = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: EASE_OUT_EXPO },
    },
} as const;

const CARD_VARIANTS_REDUCED = {
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
 * ProductPage Component
 * @description In-depth product showcase with detailed specifications
 */
export function ProductPage(): ReactNode {
    const prefersReducedMotion = useReducedMotion();
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);
    const [videoError, setVideoError] = useState(false);

    const handleWatchVideo = (productId: string): void => {
        setVideoError(false); // Reset error state when opening new video
        setPlayingVideo(productId);
    };

    const handleCloseVideo = (): void => {
        setPlayingVideo(null);
        setVideoError(false);
    };

    const handleVideoError = (): void => {
        console.error('[ProductPage] Video failed to load:', currentVideoProduct?.video);
        setVideoError(true);
    };

    // Memoized animation variants
    const containerVariants = useMemo(
        () => prefersReducedMotion ? CONTAINER_VARIANTS_REDUCED : CONTAINER_VARIANTS,
        [prefersReducedMotion]
    );

    const cardVariants = useMemo(
        () => prefersReducedMotion ? CARD_VARIANTS_REDUCED : CARD_VARIANTS,
        [prefersReducedMotion]
    );

    // Get current video product
    const currentVideoProduct = products.find((p) => p.id === playingVideo);

    return (
        <div className={styles.productPage}>
            <section className={styles.hero}>
                <motion.span
                    className={styles.eyebrow}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.5 }}
                >
                    Our Technology
                </motion.span>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, delay: 0.1 }}
                >
                    Rocket Propulsion Systems
                </motion.h1>
                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, delay: 0.2 }}
                >
                    Pioneering next-generation Methalox engines for India's space industry,
                    from prototype to production-ready systems.
                </motion.p>
            </section>

            <motion.div
                className={styles.productsGrid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {products.map((product, index) => (
                    <motion.article
                        key={product.id}
                        className={styles.productCard}
                        variants={cardVariants}
                    >
                        <div className={styles.imageWrapper}>
                            <img
                                src={product.image}
                                alt={product.name}
                                className={styles.image}
                                loading={index === 0 ? 'eager' : 'lazy'}
                            />
                            <span className={styles.badge}>{product.subtitle}</span>
                        </div>
                        <div className={styles.content}>
                            <h2 className={styles.name}>{product.name}</h2>
                            <p className={styles.description}>{product.description}</p>
                            <div className={styles.specs}>
                                {product.specs.map((spec) => (
                                    <div key={spec.label} className={styles.spec}>
                                        <span className={styles.specLabel}>{spec.label}:</span>
                                        <span className={styles.specValue}>{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                            {product.video ? (
                                <button
                                    type="button"
                                    className={styles.learnMore}
                                    onClick={(): void => handleWatchVideo(product.id)}
                                >
                                    <PlayIcon size={16} />
                                    Watch Test Video
                                    <ArrowRightIcon size={16} />
                                </button>
                            ) : (
                                <div className={styles.videoNote}>Engine under development</div>
                            )}
                        </div>
                    </motion.article>
                ))}
            </motion.div>

            <section className={styles.ctaSection}>
                <h2 className={styles.ctaTitle}>Interested in our technology?</h2>
                <p className={styles.ctaText}>
                    Partner with us to bring cutting-edge propulsion systems to your missions.
                </p>
                <Button
                    as="a"
                    href="/contact"
                    variant="primary"
                    icon={<ArrowRightIcon size={16} />}
                >
                    Get in Touch
                </Button>
            </section>

            {/* Video Modal */}
            <AnimatePresence>
                {playingVideo && currentVideoProduct?.video && (
                    <motion.div
                        className={styles.videoModal}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
                        onClick={handleCloseVideo}
                    >
                        <motion.div
                            className={styles.videoContainer}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
                            onClick={(e): void => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                className={styles.closeButton}
                                onClick={handleCloseVideo}
                                aria-label="Close video"
                            >
                                <CloseIcon size={24} />
                            </button>
                            {videoError ? (
                                <div className={styles.videoError}>
                                    <p>Video failed to load.</p>
                                    <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                                        Please check your connection and try again.
                                    </p>
                                </div>
                            ) : (
                                <video
                                    className={styles.video}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    controls
                                    onError={handleVideoError}
                                >
                                    <source src={currentVideoProduct.video} type="video/mp4" />
                                    <p>Your browser does not support HTML5 video.</p>
                                </video>
                            )}
                            <div className={styles.videoTitle}>
                                {currentVideoProduct.name} - Static Test
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
