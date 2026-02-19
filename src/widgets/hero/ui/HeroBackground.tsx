import { type ReactNode } from 'react';
import { motion, type MotionValue, useTransform } from 'framer-motion';
import styles from './hero.module.css';

interface HeroBackgroundProps {
    scrollYProgress: MotionValue<number>;
    prefersReducedMotion: boolean;
}

export function HeroBackground({ scrollYProgress, prefersReducedMotion }: HeroBackgroundProps): ReactNode {
    // Parallax transforms
    const orb1Y = useTransform(scrollYProgress, [0, 1], [0, 250]);
    const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 180]);
    const ringsOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    // Get appropriate motion settings
    const getMotionProps = (props: Record<string, unknown>) => {
        if (prefersReducedMotion) {
            return {};
        }
        return props;
    };

    return (
        <>
            {/* Background Elements */}
            <div className={styles.bgPattern} aria-hidden="true" />

            <motion.div
                className={`${styles.gradientOrb} ${styles.orb1}`}
                style={prefersReducedMotion ? {} : { y: orb1Y }}
                {...getMotionProps({
                    animate: {
                        x: [-30, 30],
                        y: [0, 40],
                    },
                    transition: {
                        duration: 10,
                        repeat: Infinity,
                        repeatType: 'reverse' as const,
                        ease: 'easeInOut',
                    },
                })}
                aria-hidden="true"
            />

            <motion.div
                className={`${styles.gradientOrb} ${styles.orb2}`}
                style={prefersReducedMotion ? {} : { y: orb2Y }}
                {...getMotionProps({
                    animate: {
                        x: [0, 40],
                        y: [-30, 20],
                    },
                    transition: {
                        duration: 12,
                        repeat: Infinity,
                        repeatType: 'reverse' as const,
                        ease: 'easeInOut',
                    },
                })}
                aria-hidden="true"
            />

            <motion.div
                className={`${styles.orbitRing} ${styles.ring1}`}
                style={prefersReducedMotion ? {} : { opacity: ringsOpacity }}
                aria-hidden="true"
            />

            <motion.div
                className={`${styles.orbitRing} ${styles.ring2}`}
                style={prefersReducedMotion ? {} : { opacity: ringsOpacity }}
                aria-hidden="true"
            />
        </>
    );
}
