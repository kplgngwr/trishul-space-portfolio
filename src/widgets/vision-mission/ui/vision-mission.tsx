import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
    useIntersection,
    useReducedMotion,
    fadeInUp,
    staggerContainer,
    scaleFade,
    getVariants,
} from '@/shared/lib';
import styles from './vision-mission.module.css';

export function VisionMission(): ReactNode {
    const { ref, hasIntersected } = useIntersection<HTMLElement>({ threshold: 0.2 });
    const prefersReducedMotion = useReducedMotion();

    const variants = {
        fadeInUp: getVariants(fadeInUp, prefersReducedMotion),
        staggerContainer: getVariants(staggerContainer, prefersReducedMotion),
        scaleFade: getVariants(scaleFade, prefersReducedMotion),
    };

    return (
        <section id="vision-mission" className={styles.section} ref={ref}>
            <div className="container">
                <motion.div
                    className={styles.wrapper}
                    initial="hidden"
                    animate={hasIntersected ? 'visible' : 'hidden'}
                    variants={variants.staggerContainer}
                >
                    {/* Section Label */}
                    <motion.div className={styles.labelRow} variants={variants.fadeInUp}>
                        <span className={styles.label}>VISION & MISSION</span>
                    </motion.div>

                    {/* Two-Column Grid */}
                    <div className={styles.grid}>
                        {/* Vision Panel */}
                        <motion.article className={styles.panel} variants={variants.scaleFade}>
                            <div className={styles.panelAccent} />
                            <h3 className={styles.panelTitle}>Vision</h3>
                            <p className={styles.panelText}>
                                To make humanity a space civilization.
                            </p>
                        </motion.article>

                        {/* Mission Panel */}
                        <motion.article className={styles.panel} variants={variants.scaleFade}>
                            <div className={styles.panelAccent} />
                            <h3 className={styles.panelTitle}>Mission</h3>
                            <p className={styles.panelText}>
                                Build reliable, high-performance technologies that deliver superior capabilities in air and space.
                            </p>
                        </motion.article>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}