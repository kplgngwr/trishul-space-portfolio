import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, ArrowLeftIcon, ArrowRightIcon } from '@/shared/ui';
import {
    useIntersection,
    useReducedMotion,
    fadeInUp,
    fadeInLeft,
    staggerContainer,
    scaleFade,
    getVariants,
} from '@/shared/lib';
import styles from './about.module.css';

// Gallery images - includes the original about.jpg plus new gallery images
const GALLERY_IMAGES = [
    { src: '/GalleryImg1.jpg', alt: 'Trishul Space Lab' },
    { src: '/GalleryImg2.JPG', alt: 'Engine Development' },
    { src: '/about.jpg', alt: 'Trishul Space Team' },
] as const;

const STATS = [
    { value: '2024', label: 'Founded' },
    { value: '10', label: 'Members' },
    { value: '3', label: 'Rocket Engines' },
] as const;

const AUTO_ROTATE_DELAY = 2000;

export function About(): ReactNode {
    const { ref, hasIntersected } = useIntersection<HTMLElement>({ threshold: 0.2 });
    const prefersReducedMotion = useReducedMotion();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);
    const [isGalleryPaused, setIsGalleryPaused] = useState(false);
    const [isCompact, setIsCompact] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 640 : false);

    const goToImage = useCallback((index: number): void => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    }, [currentIndex]);

    const handlePreviousImage = useCallback((): void => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1));
    }, []);

    const handleNextImage = useCallback((): void => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, []);

    // Auto-rotate slowly; pause while the user is inspecting or navigating.
    useEffect(() => {
        if (isGalleryPaused || prefersReducedMotion) return;

        const interval = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
        }, AUTO_ROTATE_DELAY);

        return () => clearInterval(interval);
    }, [isGalleryPaused, prefersReducedMotion]);

    useEffect(() => {
        const handleResize = (): void => {
            setIsCompact(window.innerWidth <= 640);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const variants = {
        fadeInUp: getVariants(fadeInUp, prefersReducedMotion),
        fadeInLeft: getVariants(fadeInLeft, prefersReducedMotion),
        staggerContainer: getVariants(staggerContainer, prefersReducedMotion),
        scaleFade: getVariants(scaleFade, prefersReducedMotion),
    };

    return (
        <section id="about" className={styles.section} ref={ref}>
            <div className="container">
                <motion.div
                    className={styles.gridWrapper}
                    initial="hidden"
                    animate={hasIntersected ? 'visible' : 'hidden'}
                    variants={variants.staggerContainer}
                >
                    <motion.header className={styles.sectionHeader} variants={variants.fadeInUp}>
                        <span className="section-eyebrow">Introduction</span>
                        <h2 className={styles.title}>Meet The team</h2>
                    </motion.header>

                    <div className={styles.grid}>
                        <motion.div className={styles.imageContainer} variants={variants.fadeInLeft}>
                            <div
                                className={styles.gallery}
                                onMouseEnter={(): void => setIsGalleryPaused(true)}
                                onMouseLeave={(): void => setIsGalleryPaused(false)}
                                onFocus={(): void => setIsGalleryPaused(true)}
                                onBlur={(): void => setIsGalleryPaused(false)}
                            >
                                <AnimatePresence initial={false} mode="popLayout">
                                    <motion.img
                                        key={currentIndex}
                                        src={GALLERY_IMAGES[currentIndex].src}
                                        alt={GALLERY_IMAGES[currentIndex].alt}
                                        className={styles.galleryImage}
                                        initial={{
                                            opacity: 0,
                                            scale: prefersReducedMotion ? 1 : 1.035,
                                            x: prefersReducedMotion ? 0 : direction * 24,
                                        }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{
                                            opacity: 0,
                                            scale: prefersReducedMotion ? 1 : 0.985,
                                            x: prefersReducedMotion ? 0 : direction * -20,
                                        }}
                                        transition={{
                                            duration: prefersReducedMotion ? 0.01 : isCompact ? 0.8 : 1.15,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                    />
                                </AnimatePresence>

                                <button
                                    type="button"
                                    className={`${styles.galleryArrow} ${styles.galleryArrowLeft}`}
                                    onClick={handlePreviousImage}
                                    aria-label="Show previous gallery image"
                                >
                                    <ArrowLeftIcon size={18} />
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.galleryArrow} ${styles.galleryArrowRight}`}
                                    onClick={handleNextImage}
                                    aria-label="Show next gallery image"
                                >
                                    <ArrowRightIcon size={18} />
                                </button>

                                <div className={styles.galleryNav} aria-label="About gallery images">
                                    {GALLERY_IMAGES.map((image, index) => (
                                        <button
                                            key={image.src}
                                            type="button"
                                            className={`${styles.galleryDot} ${index === currentIndex ? styles.galleryDotActive : ''}`}
                                            onClick={(): void => goToImage(index)}
                                            aria-label={`Show ${image.alt}`}
                                            aria-current={index === currentIndex ? 'true' : undefined}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <div className={styles.content}>
                            <motion.div className={styles.text} variants={variants.staggerContainer}>
                                <motion.p variants={variants.fadeInUp}>
                                    Trishul Space is a space technology startup advancing liquid rocket propulsion systems for the global space industry. Founded by a team of aerospace engineers and propulsion specialists, we are driven by a shared mission to simplify rocket development and accelerate access to space.
                                </motion.p>
                                <motion.p variants={variants.fadeInUp}>
                                    We design and manufacture modular, high-performance, ready-to-integrate liquid rocket engines that help launch vehicle developers reduce development timelines, lower capital costs, and focus on mission innovation.
                                </motion.p>
                                <motion.p variants={variants.fadeInUp}>
                                    With expertise in propulsion development, testing, manufacturing, and systems integration, our team is building standardized propulsion solutions to support the rapidly growing demand for satellite launches from emerging space companies and government space agencies worldwide.
                                </motion.p>
                            </motion.div>

                            <motion.div className={styles.stats} variants={variants.staggerContainer}>
                                {STATS.map((stat) => ( <motion.div key={stat.label} className={styles.stat} variants={variants.scaleFade} >
                                        <span className={styles.statValue}>{stat.value}</span>
                                        <span className={styles.statLabel}>{stat.label}</span>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <motion.div variants={variants.fadeInUp}>
                                <Button as="a" href="/career" variant="primary" icon={<ArrowRightIcon size={18} />}> Join Our Team </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
