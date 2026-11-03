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
import { PartnerRow } from './PartnerRow';
import styles from './partners.module.css';

const categoryMap = [
    { key: 'supporter', label: 'Supported By' },
    { key: 'investor', label: 'Investors' },
    { key: 'partner', label: 'Partners' },
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

    const groupedPartners = categoryMap.map((category) => ({
        ...category,
        partners: partners.filter((partner) => partner.categories.includes(category.key)),
    }));

    return (
        <section id="partners" className={styles.section} ref={ref}>
            <div className="container">
                <motion.div
                    initial="hidden"
                    animate={hasIntersected ? 'visible' : 'hidden'}
                    variants={variants.staggerContainer}
                >
                    <motion.header className={styles.header} variants={variants.fadeInUp}>
                        <span className="section-eyebrow">Supported By</span>
                    </motion.header>

                    {groupedPartners.map((group) => (
                        <motion.div className={styles.group} key={group.key} variants={variants.fadeInUp}>

                            {group.key !== 'supporter' && (
                                <motion.h2 className={styles.groupLabel} variants={variants.fadeInUp}>
                                    {group.label}
                                </motion.h2>
                            )}

                            <PartnerRow
                                label={group.label}
                                partners={group.partners}
                                listVariants={variants.staggerContainer}
                                cardVariants={variants.scaleFade}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
