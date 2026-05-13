import { type ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import {
    useIntersection,
    useReducedMotion,
    fadeInUp,
    staggerContainer,
    getVariants,
} from '@/shared/lib';
import styles from './test-facility.module.css';

const CAPABILITIES = [
    'Integrated Test Systems',
    'High-Speed Telemetry',
    'Cryogenic Infrastructure',
    'Automated Safety Interlocks',
    'Modular Engine Bays',
] as const;

export function TestFacility(): ReactNode {
    const { ref, hasIntersected } = useIntersection<HTMLElement>({ threshold: 0.2 });
    const prefersReducedMotion = useReducedMotion();
    const [isMuted, setIsMuted] = useState(true);

    const variants = {
        fadeInUp: getVariants(fadeInUp, prefersReducedMotion),
        staggerContainer: getVariants(staggerContainer, prefersReducedMotion),
    };

    return (
        <section id="test-facility" className={styles.section} ref={ref}>
            <video
                className={styles.ambientVideo}
                src="/Test-Facility.mp4"
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
                tabIndex={-1}
            />
            <div className={styles.backgroundOverlay} aria-hidden="true" />

            <div className={styles.container}>
                <motion.div
                    className={styles.sectionFrame}
                    initial="hidden"
                    animate={hasIntersected || prefersReducedMotion ? 'visible' : 'hidden'}
                    variants={variants.staggerContainer}
                >
                    <motion.header className={styles.sectionHeader} variants={variants.fadeInUp}>
                        <span className="section-eyebrow">Test Facility</span>
                    </motion.header>

                    <motion.div className={styles.videoPanel} variants={variants.fadeInUp}>
                        <div className={styles.videoFrame}>
                            <video
                                className={styles.facilityVideo}
                                src="/Test-Facility.mp4"
                                autoPlay
                                loop
                                muted={isMuted}
                                playsInline
                                aria-label="Testing facility video loop"
                            />
                            <div className={styles.videoTitleOverlay}>
                                <h2 className={styles.title}>Where Innovation Meets Precision</h2>
                            </div>
                            <button
                                type="button"
                                className={styles.volumeButton}
                                onClick={() => setIsMuted(!isMuted)}
                                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                            >
                                {isMuted ? (
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M11 5L6.5 8.5H3v7h3.5L11 19V5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                                        <path d="M16 9l4 4m0-4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M11 5L6.5 8.5H3v7h3.5L11 19V5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                                        <path d="M14.5 9.5a4 4 0 0 1 0 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M17 7a7 7 0 0 1 0 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                )}
                            </button>
                            <div className={styles.videoGlow} aria-hidden="true" />
                        </div>
                    </motion.div>

                    <div className={styles.capabilityStrip}>
                        <div className={styles.capabilityTrack}>
                            {[...CAPABILITIES, ...CAPABILITIES].map((capability, index) => (
                                <span key={`${capability}-${index}`} className={styles.capabilityItem}>
                                    {capability}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
