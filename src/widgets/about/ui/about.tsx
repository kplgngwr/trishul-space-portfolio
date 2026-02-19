import { type ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, ArrowRightIcon } from '@/shared/ui';
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
    { src: '/GalleryImg3.JPG', alt: 'Testing Facility' },
    { src: '/GalleryImg4.jpg', alt: 'Team at Work' },
    { src: '/about.jpg', alt: 'Trishul Space Team' },
] as const;

const STATS = [
    { value: '2022', label: 'Founded' },
    { value: '10+', label: 'Members' },
    { value: '3', label: 'Rocket Engines' },
] as const;


export function About(): ReactNode {
    const { ref, hasIntersected } = useIntersection<HTMLElement>({ threshold: 0.2 });
    const prefersReducedMotion = useReducedMotion();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isCompact, setIsCompact] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 640 : false);

    // Auto-rotate images every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

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
                            <div className={styles.gallery}>
                                <AnimatePresence initial={false} mode="popLayout">
                                    <motion.img
                                        key={currentIndex}
                                        src={GALLERY_IMAGES[currentIndex].src}
                                        alt={GALLERY_IMAGES[currentIndex].alt}
                                        className={styles.galleryImage}
                                        initial={{ x: '100%', opacity: 1 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: '-100%', opacity: 1 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 30,
                                            duration: prefersReducedMotion ? 0.01 : isCompact ? 0.45 : 0.6
                                        }}
                                    />
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        <div className={styles.content}>
                            <motion.div className={styles.text} variants={variants.staggerContainer}>
                                <motion.p variants={variants.fadeInUp}>
                                    We are space tech startup advancing liquid rocket propulsion
                                    systems for the global space industry. We design and manufacture modular,
                                    high-performance, ready-to-use liquid rocket engines that enable launch vehicle
                                    developers to reduce development time, lower capital expenditure, and accelerate
                                    market entry.
                                </motion.p>
                                <motion.p variants={variants.fadeInUp}>
                                    Our flagship product, Harpy-1, is a 37kN (vacuum thrust) LOX/LNG Fuel rich staged-combustion 
                                    engine designed for high performance, targeting 340s specific impulse and features ML-powered 
                                    failure detection system for enhanced reliability and operational safety. Through standardized 
                                    propulsion solutions, we support the growing demand for satellite launches by serving both emerging
                                    space companies and government space agencies.
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
                                <Button as="a" href="/team" variant="primary" icon={<ArrowRightIcon size={18} />}> Our Team </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
