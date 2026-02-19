import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { partners } from '@/entities/partner';
import {
    useIntersection,
    useReducedMotion,
    fadeInUp,
    staggerContainer,
    scaleFade,
    getVariants,
} from '@/shared/lib';
import styles from './partners.module.css';

// Collapse all partner categories into a single 'Industry' carousel
const categoryMap = [
    { key: 'industry', label: 'Industry', autoScroll: true },
] as const;

/**
 * Partners Widget
 * @description Investors and partners showcase
 */
export function Partners(): ReactNode {
    const { ref, hasIntersected } = useIntersection<HTMLElement>({ threshold: 0.3 });
    const prefersReducedMotion = useReducedMotion();

    const variants = {
        fadeInUp: getVariants(fadeInUp, prefersReducedMotion),
        staggerContainer: getVariants(staggerContainer, prefersReducedMotion),
        scaleFade: getVariants(scaleFade, prefersReducedMotion),
    };

    // Put all partners under the single Industry group (preserve auto-scroll)
    const groupedPartners = categoryMap.map((category) => ({
        ...category,
        partners: partners,
    }));

    return (
        <section id="partners" className={styles.section} ref={ref}>
            <div className="container">
                <motion.div
                    initial="hidden"
                    animate={hasIntersected ? 'visible' : 'hidden'}
                    variants={variants.staggerContainer}
                >
                    {/* Section Header */}
                    <motion.header className={styles.header} variants={variants.fadeInUp}>
                        <span className="section-eyebrow">Trusted By</span>
                        <h2 className={styles.title}>Investors, Partners & Incubators</h2>
                    </motion.header>

                    {groupedPartners.map((group) => (
                        <motion.div className={styles.group} key={group.key} variants={variants.fadeInUp}>
                            <motion.h3 className={styles.groupLabel} variants={variants.fadeInUp}>
                                {group.label}
                            </motion.h3>
                            {group.autoScroll && !prefersReducedMotion ? (
                                <motion.div className={styles.carousel} variants={variants.staggerContainer}>
                                    <motion.div className={styles.track} variants={variants.staggerContainer}>
                                        {[...group.partners, ...group.partners].map((partner, index) => (
                                            <motion.a
                                                key={`${group.key}-${partner.name}-${index}`}
                                                href={partner.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`${styles.card} ${partner.isDark ? styles.darkCard : ''}`}
                                                variants={variants.scaleFade}
                                            >
                                                <div className={styles.logo}>
                                                    <img src={partner.logo} alt={partner.name} />
                                                </div>
                                                <span className={styles.name}>{partner.name}</span>
                                            </motion.a>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.div className={styles.staticList} variants={variants.staggerContainer}>
                                    {group.partners.map((partner) => (
                                        <motion.a
                                            key={`${group.key}-${partner.name}`}
                                            href={partner.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${styles.card} ${partner.isDark ? styles.darkCard : ''}`}
                                            variants={variants.scaleFade}
                                        >
                                            <div className={styles.logo}>
                                                <img src={partner.logo} alt={partner.name} />
                                            </div>
                                            <span className={styles.name}>{partner.name}</span>
                                        </motion.a>
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
