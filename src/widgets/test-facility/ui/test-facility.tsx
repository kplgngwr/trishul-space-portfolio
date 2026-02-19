import { type ReactNode, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    useIntersection,
    useReducedMotion,
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    staggerContainer,
    getVariants,
} from '@/shared/lib';
import styles from './test-facility.module.css';

const CAPABILITIES = [
    'Advanced instrumentation and sensor arrays',
    'Multi-layered safety interlocks and emergency systems',
    'High-speed data acquisition systems', 
    'Modular test stand configurations'
] as const;


export function TestFacility(): ReactNode {
    const { ref, hasIntersected } = useIntersection<HTMLElement>({ threshold: 0.2 });
    const prefersReducedMotion = useReducedMotion();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showOverlay, setShowOverlay] = useState(true);

    const variants = {
        fadeInUp: getVariants(fadeInUp, prefersReducedMotion),
        fadeInLeft: getVariants(fadeInLeft, prefersReducedMotion),
        fadeInRight: getVariants(fadeInRight, prefersReducedMotion),
        staggerContainer: getVariants(staggerContainer, prefersReducedMotion),
    };

    const handlePlayToggle = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
            setShowOverlay(false);
        } else {
            video.pause();
            setIsPlaying(false);
            setShowOverlay(true);
        }
    }, []);

    const handleVideoEnd = useCallback(() => {
        setIsPlaying(false);
        setShowOverlay(true);
    }, []);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handlePlayToggle();
        }
    }, [handlePlayToggle]);

    return (
        <section id="test-facility" className={styles.section} ref={ref}>
            {/* Background Video */}
            <video
                ref={videoRef}
                className={styles.videoBackground}
                muted
                loop
                playsInline
                autoPlay
                onEnded={handleVideoEnd}
                onPause={() => {
                    setIsPlaying(false);
                }}
                onPlay={() => {
                    setIsPlaying(true);
                }}
                aria-label="Testing facility background video"
            >
                <source src="/Test-Facility.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            {showOverlay && <div className={styles.videoOverlay} />}

            {/* Video Controls */}
            <div className={styles.videoControls}>
                <button
                    className={styles.controlButton}
                    onClick={handlePlayToggle}
                    onKeyDown={handleKeyDown}
                    type="button"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                    {isPlaying ? (
                        <div className={styles.pauseIcon} aria-hidden="true" />
                    ) : (
                        <div className={styles.playIcon} aria-hidden="true" />
                    )}
                </button>
            </div>


            {/* Overlaid Content */}
            <div className={styles.container}>
                <div className={styles.containerInner}>
                    <motion.div
                        initial="hidden"
                        animate={hasIntersected ? 'visible' : 'hidden'}
                        variants={variants.staggerContainer}
                    >
                        {/* Section Header */}
                        <motion.header className={styles.header} variants={variants.fadeInUp}>
                            <div className={styles.kicker}>
                                <span className={styles.kickerText}>test facility</span>
                            </div>
                            <h4 className={styles.title}>Where Innovation Meets Precision</h4>
                        </motion.header>

                        {/* Content */}
                        <motion.div className={styles.content} variants={variants.fadeInUp}>
                            <motion.div className={styles.capabilities} variants={variants.staggerContainer}>
                                {CAPABILITIES.map((capability, index) => (
                                    <motion.div
                                        key={index}
                                        className={styles.capability}
                                        variants={variants.fadeInUp}
                                    >
                                        <span className={styles.capabilityIcon} aria-hidden="true" />
                                        <span className={styles.capabilityText}>{capability}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
