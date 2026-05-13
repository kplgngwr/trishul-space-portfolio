import { useRef, useState, useCallback, Suspense, type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
    motion,
    AnimatePresence,
    useMotionValue,
    animate,
} from 'framer-motion';
import { products } from '@/entities/product';
import { ErrorFallback } from '@/shared/ui';
import { useReducedMotion, EASE_OUT_EXPO } from '@/shared/lib';
import { RocketModel } from './RocketModel';
import styles from './technology.module.css';

/**
 * Technology Widget
 * @description Scroll-driven product showcase with sticky scroll behavior and tab navigation
 */
export function Technology(): ReactNode {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    // Progress value that can be controlled manually when tabs change
    const progressValue = useMotionValue(0);

    const [activeIndex, setActiveIndex] = useState<number>(0);

    const handleTabClick = useCallback((index: number): void => {
        if (!containerRef.current) return;

        setActiveIndex(index);

        // Calculate and animate progress bar to match selected tab
        const targetProgress = (index + 0.5) / products.length;
        animate(progressValue, targetProgress, {
            duration: prefersReducedMotion ? 0.01 : 0.4,
            ease: EASE_OUT_EXPO,
        });

        // Calculate scroll position for this tab
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerTop = window.scrollY + containerRect.top;
        const scrollHeight = containerRef.current.scrollHeight - window.innerHeight;
        const targetScrollY = containerTop + (scrollHeight * targetProgress);

        window.scrollTo({
            top: targetScrollY,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    }, [prefersReducedMotion, progressValue]);



    return (
        <section
            id="technology"
            className={styles.section}
            ref={containerRef}
            style={{ position: 'relative' }}
        >
            <div className={styles.scrollContainer}>
                <div className={styles.stickyContent}>
                    <div className={styles.grid}>
                        {/* Left Side - Feature List */}
                        <div className={styles.featureList}>
                            <header className={styles.header}>
                                <span className="section-eyebrow">Our Technology</span>
                                <h2 className={styles.title}>Products</h2>
                            </header>

                            <ul className={styles.list} role="tablist" aria-label="Product tabs">
                                {products.map((product, index) => {
                                    const isActive = index === activeIndex;

                                    return (
                                        <li
                                            key={product.id}
                                            role="tab"
                                            aria-selected={isActive}
                                            tabIndex={0}
                                            className={`${styles.item} ${isActive ? styles.active : ''}`}
                                            onClick={(): void => handleTabClick(index)}
                                            onKeyDown={(e): void => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    handleTabClick(index);
                                                }
                                            }}
                                        >
                                            <h3 className={styles.name}>
                                                {product.name}
                                                {product.isUnderDevelopment && (
                                                    <span className={styles.developmentBadge}>
                                                        Under Development
                                                    </span>
                                                )}
                                            </h3>

                                            <AnimatePresence>
                                                {isActive && (
                                                    <motion.div
                                                        className={styles.descWrapper}
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{
                                                            duration: prefersReducedMotion ? 0.01 : 0.4,
                                                            ease: EASE_OUT_EXPO,
                                                        }}
                                                    >
                                                        <p className={styles.description}>{product.description}</p>
                                                        <div className={styles.specs}>
                                                            {product.specs.map((spec) => (
                                                                <span key={spec.label} className={styles.spec}>
                                                                    <span className={styles.specLabel}>{spec.label}:</span>
                                                                    <span className={styles.specValue}>{spec.value}</span>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* <Button as="a" href="/product" variant="primary" className={styles.cta} > Explore Products </Button> */}
                        </div>

                        {/* Right Side - Media */}
                        <div className={styles.mediaContainer}>
                            <div className={styles.mediaWrapper}>
                                <div className={styles.mediaStack}>
                                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                                        <Suspense fallback={<div className={styles.modelLoading} />}>
                                            <RocketModel />
                                        </Suspense>
                                    </ErrorBoundary>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}
