import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
    useIntersection,
    useReducedMotion,
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    staggerContainer,
    scaleFade,
    getVariants,
} from '@/shared/lib';
import styles from './mission.module.css';

/**
 * Stat data for the "problem" cards
 */
const PROBLEM_STATS = [
    {
        icon: 'warning' as const,
        label: 'Launch Failures',
        value: '54%',
        desc: 'Originate from propulsion-related issues during ascent.',
    },
    {
        icon: 'cost' as const,
        label: 'Vehicle Cost',
        value: '60%',
        desc: 'Of total launch vehicle cost is driven by the engine stack.',
    },
    {
        icon: 'complexity' as const,
        label: 'Engineering Complexity',
        value: '90%',
        desc: 'Of rocket engineering complexity lies within the engine.',
    },
] as const;

/**
 * Enhanced animated SVG icons for stat cards
 */
function AlertTriangleIcon(): ReactNode {
    return (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {/* Animated background glow */}
            <defs>
                <linearGradient id="warnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity="0.1" />
                </linearGradient>
            </defs>
            {/* Outer animated ring */}
            <circle cx="12" cy="12" r="11" fill="url(#warnGradient)" stroke="#f97316" strokeWidth="0.5" opacity="0.6" />
            {/* Main triangle */}
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
                stroke="#f97316" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Exclamation mark */}
            <line x1="12" x2="12" y1="9" y2="13" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.5" fill="#f97316" />
        </svg>
    );
}

function DollarIcon(): ReactNode {
    return (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <defs>
                <linearGradient id="costGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e40af" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                </linearGradient>
            </defs>
            {/* Outer ring */}
            <circle cx="12" cy="12" r="11" fill="url(#costGradient)" stroke="#1e40af" strokeWidth="0.5" opacity="0.6" />
            {/* Currency symbol with flowing design */}
            <path d="M12 2v3" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19v3" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dollar curve design */}
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                stroke="#1e40af" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CogIcon(): ReactNode {
    return (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <defs>
                <linearGradient id="cogGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#64748b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.1" />
                </linearGradient>
            </defs>
            {/* Outer ring */}
            <circle cx="12" cy="12" r="11" fill="url(#cogGradient)" stroke="#64748b" strokeWidth="0.5" opacity="0.6" />
            {/* Main gear shape with enhanced design */}
            <g stroke="#64748b" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* Center circle */}
                <circle cx="12" cy="12" r="3" />
                {/* Gear teeth */}
                <path d="M12 2v2M12 20v2M20 12h2M2 12h2M17 7l1.41-1.41M5.59 18.41L7 17M17 17l1.41 1.41M5.59 5.59L7 7" />
            </g>
        </svg>
    );
}

const STAT_ICONS: Record<string, () => ReactNode> = {
    warning: AlertTriangleIcon,
    cost: DollarIcon,
    complexity: CogIcon,
};

/**
 * Mission Widget
 * @description Showcases the core industry problem Trishul Space is solving –
 * "Propulsion is the Bottleneck" – with compelling statistics and a visual.
 */
export function Mission(): ReactNode {
    const { ref, hasIntersected } = useIntersection<HTMLElement>({ threshold: 0.15 });
    const prefersReducedMotion = useReducedMotion();

    const variants = {
        fadeInUp: getVariants(fadeInUp, prefersReducedMotion),
        fadeInLeft: getVariants(fadeInLeft, prefersReducedMotion),
        fadeInRight: getVariants(fadeInRight, prefersReducedMotion),
        staggerContainer: getVariants(staggerContainer, prefersReducedMotion),
        scaleFade: getVariants(scaleFade, prefersReducedMotion),
    };

    return (
        <section id="mission" className={styles.section} ref={ref}>
            <div className="container">
                <motion.div
                    className={styles.gridWrapper}
                    initial="hidden"
                    animate={hasIntersected ? 'visible' : 'hidden'}
                    variants={variants.staggerContainer}
                >
                    {/* Section Header */}
                    <motion.header className={styles.sectionHeader} variants={variants.fadeInUp}>
                        <span className="section-eyebrow">Capability Gap</span>
                        <h2 className={styles.title}>Propulsion Shapes the Future of Spaceflight</h2>
                        <p className={styles.subtitle}> Why we exist — and why it matters for the future of space access. </p>
                    </motion.header>

                    {/* Two-column layout */}
                    <div className={styles.mainGrid}>
                        {/* Left – text + stats */}
                        <motion.div className={styles.contentSide} variants={variants.fadeInLeft}>
                            <p className={styles.description}> Rocket propulsion remains the biggest bottleneck in launch vehicle development — demanding years of engineering, massive capital, and repeated testing. At Trishul Space, we are building ready-to-integrate propulsion systems that simplify launch vehicle development and accelerate access to space. </p>

                            <motion.div
                                className={styles.statsGrid}
                                variants={variants.staggerContainer}
                                initial="hidden"
                                animate={hasIntersected ? 'visible' : 'hidden'}
                            >
                                {PROBLEM_STATS.map((stat) => {
                                    const IconComponent = STAT_ICONS[stat.icon];
                                    return (
                                        <motion.div
                                            key={stat.label}
                                            className={styles.statCard}
                                            variants={variants.scaleFade}
                                        >
                                            <div className={styles.statIconRow}>
                                                <div className={`${styles.statIcon} ${styles[stat.icon]}`}>
                                                    <IconComponent />
                                                </div>
                                                <span className={styles.statLabel}>{stat.label}</span>
                                            </div>
                                            <span className={styles.statValue}>{stat.value}</span>
                                            <span className={styles.statDesc}>{stat.desc}</span>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </motion.div>

                        {/* Right – visual */}
                        <motion.div className={styles.visualSide} variants={variants.fadeInRight}>
                            <img
                                src="/products/harpy-sketch-2.png"
                                alt="Trishul Space Cryo-Valve Engine Interface"
                                className={styles.engineImage}
                                loading="lazy"
                            />
                        </motion.div>
                    </div>

                    {/* Necessity bar at bottom */}
                    <motion.div className={styles.necessityBar} variants={variants.fadeInUp}>
                        <span className={styles.necessityLabel}>Necessity</span>
                        <div className={styles.necessityDivider} />
                        <p className={styles.necessityText}> At <strong>Trishul Space</strong>, we are building ready-to-integrate propulsion systems that simplify launch vehicle development and <strong>accelerate access to space</strong> — making it faster, cheaper, and more reliable for the next generation of launch providers. </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
