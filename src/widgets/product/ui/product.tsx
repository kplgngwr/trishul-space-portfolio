import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    useIntersection,
    useReducedMotion,
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    staggerContainer,
    getVariants,
} from '@/shared/lib';
import { products } from '@/entities/product';
import styles from './product.module.css';

export function Product(): ReactNode {
    const navigate = useNavigate();
    const { ref, hasIntersected } = useIntersection<HTMLElement>({ threshold: 0.15 });
    const prefersReducedMotion = useReducedMotion();

    const [productIndex] = useState(0);
    const product = products[productIndex];
    const [activeVariant, setActiveVariant] = useState(product.variants[0]?.key ?? '');
    const currentVariant = product.variants.find((variant) => variant.key === activeVariant) ?? product.variants[0];

    const nextProduct = () => {
        // TODO: implement actual product cycling
        console.log('next product');
    };
    const prevProduct = () => {
        // TODO: implement actual product cycling
        console.log('previous product');
    };

    const variants = {
        fadeInUp: getVariants(fadeInUp, prefersReducedMotion),
        fadeInLeft: getVariants(fadeInLeft, prefersReducedMotion),
        fadeInRight: getVariants(fadeInRight, prefersReducedMotion),
        staggerContainer: getVariants(staggerContainer, prefersReducedMotion),
    };

    return (
        <section id="product" className={styles.section} ref={ref}>
            <div className="container">
                <motion.div
                    className={styles.gridWrapper}
                    initial="hidden"
                    animate={hasIntersected ? 'visible' : 'hidden'}
                    variants={variants.staggerContainer}
                >
                    {/* Header – centered */}
                    <motion.header className={styles.sectionHeader} variants={variants.fadeInUp}>
                        <span className="section-eyebrow">Our Solution</span>
                        <h2 className={styles.title}>{product.name}</h2>
                        <p className={styles.subtitle}>{product.description}</p>
                    </motion.header>

                    {/* Main two‑column showcase */}
                    <div className={styles.mainGrid}>
                        {/* LEFT – Visual panel */}
                        <motion.div className={styles.visualSide} variants={variants.fadeInLeft}>
                            {/* Navigation arrows */}
                            <button className={styles.arrowButton} aria-label="Previous product" onClick={prevProduct}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className={styles.arrowButton} aria-label="Next product" onClick={nextProduct}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={`${currentVariant?.key ?? activeVariant}-image`}
                                    src={currentVariant?.image ?? product.image}
                                    alt={`Harpy-1 ${currentVariant?.label ?? product.name} Engine`}
                                    className={styles.productImage}
                                    loading="lazy"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{
                                        duration: prefersReducedMotion ? 0.01 : 0.3,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                />
                            </AnimatePresence>
                        </motion.div>

                        {/* RIGHT – Technical specifications */}
                        <motion.div className={styles.contentSide} variants={variants.fadeInRight}>
                            {/* Top row: variant selector + hero metric */}
                            <div className={styles.topMetaRow}>
                                <motion.div className={styles.variantBlock} variants={variants.fadeInUp}>
                                    <div className={styles.variantTabs} role="tablist" aria-label="Engine configuration">
                                        {product.variants.map((variant) => (
                                            <button
                                                key={variant.key}
                                                className={`${styles.variantTab} ${activeVariant === variant.key ? styles.active : ''}`}
                                                onClick={() => setActiveVariant(variant.key)}
                                                aria-pressed={activeVariant === variant.key}
                                                role="tab"
                                            >
                                                {variant.label}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div className={styles.heroMetric} variants={variants.fadeInUp}>
                                    <div className={styles.heroValue}>{currentVariant?.thrust ?? product.variants[0]?.thrust}</div>
                                    <div className={styles.heroLabel}>Nominal Thrust</div>
                                </motion.div>
                            </div>

                            {/* Specs table */}
                            <motion.div
                                className={styles.specsTable}
                                variants={variants.staggerContainer}
                                initial="hidden"
                                animate={hasIntersected ? 'visible' : 'hidden'}
                            >
                                {product.specs.map((spec, index) => (
                                    <motion.div
                                        key={spec.label}
                                        className={styles.specRow}
                                        variants={{
                                            hidden: { opacity: 0, y: 10 },
                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    delay: index * 0.05,
                                                    duration: prefersReducedMotion ? 0.01 : 0.4,
                                                },
                                            },
                                        }}
                                    >
                                        <div className={styles.specLabel}>{spec.label}</div>
                                        <div className={styles.specValue}>
                                            {spec.label.toLowerCase().includes('thrust') ? currentVariant?.thrust ?? spec.value : spec.value}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* CTA area */}
                            <motion.div className={styles.ctaSection} variants={variants.fadeInUp}>
                                <div className={styles.ctaRow}>
                                    <button className={`${styles.ctaButton} ${styles.primary}`} onClick={() => navigate('/contact')}>Request Specifications</button>
                                    {/* <button className={`${styles.ctaButton} ${styles.secondary}`}>Download Datasheet</button> */}
                                </div>
                                {/* <button className={styles.textCta}>Request Specifications</button> */}
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
