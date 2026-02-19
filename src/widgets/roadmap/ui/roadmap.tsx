import { useRef, useState, useCallback, useEffect, Suspense, type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
    motion,
    useScroll,
    useMotionValueEvent,
    useMotionValue,
    animate,
    AnimatePresence,
} from 'framer-motion';
import { milestones, visionItems } from '@/entities/milestone';
import { CheckIcon, LayersIcon, ErrorFallback } from '@/shared/ui';
import { useReducedMotion, EASE_OUT_EXPO, slideChange } from '@/shared/lib';
import { RocketModel } from './RocketModel';
import styles from './roadmap.module.css';

/**
 * Roadmap Widget
 * @description Scroll-driven timeline with milestone details and tab navigation
 */
export function Roadmap(): ReactNode {
    const containerRef = useRef<HTMLDivElement>(null);
    const markerScrollerRef = useRef<HTMLDivElement>(null);
    const scrollerRef = useRef<HTMLDivElement>(null);
    const markerRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isManualNavigation, setIsManualNavigation] = useState<boolean>(false);
    const prefersReducedMotion = useReducedMotion();
    const totalSteps = milestones.length + 1; // +1 for vision

    const progressValue = useMotionValue(0);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        // Animate while the section is within the viewport
        // 0: when top enters bottom; 1: when bottom exits top
        offset: ['start end', 'end start'],
    });

    // Keep model rotation synced to scroll unless we're navigating manually
    useMotionValueEvent(scrollYProgress, 'change', (latest: number): void => {
        if (isManualNavigation) return;
        progressValue.set(latest);
    });

    const [isCompactTimeline, setIsCompactTimeline] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(max-width: 768px)').matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handleChange = (event: MediaQueryListEvent) => setIsCompactTimeline(event.matches);

        mediaQuery.addEventListener?.('change', handleChange);

        return () => {
            mediaQuery.removeEventListener?.('change', handleChange);
        };
    }, []);

    const denominator = Math.max(totalSteps - 1, 1);
    const progressPercent = (activeIndex / denominator) * 100;
    const progressStyle = isCompactTimeline
        ? { width: `${progressPercent}%` }
        : { height: `${progressPercent}%` };

    const markerRefsSetter = useCallback(
        (index: number) => (node: HTMLButtonElement | null) => {
            markerRefs.current[index] = node;
        },
        [],
    );

    const cardRefsSetter = useCallback(
        (index: number) => (node: HTMLDivElement | null) => {
            cardRefs.current[index] = node;
        },
        [],
    );

    const activeIndexRef = useRef(activeIndex);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    useEffect(() => {
        const scroller = scrollerRef.current;
        const markerScroller = markerScrollerRef.current;
        if (!scroller && !markerScroller) return;
        let frame: number | null = null;

        const computeIndex = (scrollLeft: number, containerWidth: number) => {
            const index = Math.round(scrollLeft / Math.max(containerWidth, 1));
            return Math.min(Math.max(index, 0), milestones.length);
        };

        const handleCardScroll = () => {
            if (!scroller) return;
            if (frame) cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const width = scroller.offsetWidth || 1;
                const nextIndex = computeIndex(scroller.scrollLeft, width);
                if (nextIndex !== activeIndexRef.current) {
                    setActiveIndex(nextIndex);
                }
            });
        };

        const handleMarkerScroll = () => {
            if (!markerScroller) return;
            if (frame) cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const markerWidth = Math.max(markerScroller.clientWidth, 1);
                const nextIndex = Math.min(Math.max(Math.round(markerScroller.scrollLeft / markerWidth), 0), milestones.length);
                if (nextIndex !== activeIndexRef.current) {
                    setActiveIndex(nextIndex);
                }
            });
        };

        scroller?.addEventListener('scroll', handleCardScroll, { passive: true });
        markerScroller?.addEventListener('scroll', handleMarkerScroll, { passive: true });

        return () => {
            scroller?.removeEventListener('scroll', handleCardScroll);
            markerScroller?.removeEventListener('scroll', handleMarkerScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [milestones.length]);

    useEffect(() => {
        const marker = markerRefs.current[activeIndex];
        if (marker && markerScrollerRef.current) {
            const container = markerScrollerRef.current;
            const target = marker.offsetLeft + marker.offsetWidth / 2 - container.clientWidth / 2;
            container.scrollTo({
                left: target,
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
            });
        }

        const card = cardRefs.current[activeIndex];
        if (card && scrollerRef.current) {
            scrollerRef.current.scrollTo({
                left: card.offsetLeft,
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
            });
        }
    }, [activeIndex, prefersReducedMotion]);

    const handleTabClick = useCallback((index: number): void => {
        if (!containerRef.current) return;

        setIsManualNavigation(true);
        setActiveIndex(index);

        // Calculate scroll position for this tab
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerTop = window.scrollY + containerRect.top;
        const scrollHeight = containerRef.current.scrollHeight - window.innerHeight;
        const targetProgress = (index + 0.5) / totalSteps;
        const targetScrollY = containerTop + (scrollHeight * targetProgress);

        // Animate the model rotation immediately to match the selected marker
        animate(progressValue, targetProgress, {
            duration: prefersReducedMotion ? 0.01 : 0.4,
            ease: EASE_OUT_EXPO,
        });

        window.scrollTo({
            top: targetScrollY,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        // Reset manual navigation flag after scroll completes
        setTimeout(() => {
            setIsManualNavigation(false);
        }, prefersReducedMotion ? 50 : 600);
    }, [prefersReducedMotion, totalSteps]);

    const isVisionSlide = activeIndex >= milestones.length;
    const currentMilestone = !isVisionSlide ? milestones[activeIndex] : null;

    return (
        <section id="roadmap" className={styles.wrapper} ref={containerRef} style={{ position: 'relative' }}>
            <div className={styles.scrollHeight}>
                <div className={styles.sticky}>
                    {/* Header */}
                    <div className={styles.header}>
                        <span className="section-eyebrow">Our Journey</span>
                        <h2 className={styles.title}>Milestones</h2>
                    </div>

                    {isCompactTimeline ? (
                        <div className={styles.mobileOnly}>
                            <div className={styles.hMarkersWrap}>
                                <div className={styles.hLine} />
                                <motion.div className={styles.hProgress} style={progressStyle} />
                                <div className={styles.hMarkers} ref={markerScrollerRef} role="tablist" aria-label="Roadmap steps">
                                    {milestones.map((m, i) => (
                                        <button
                                            key={m.id}
                                            ref={markerRefsSetter(i)}
                                            type="button"
                                            role="tab"
                                            aria-selected={i === activeIndex}
                                            className={`${styles.hMarker} ${i === activeIndex ? styles.hMarkerActive : ''} ${i < activeIndex ? styles.hMarkerDone : ''}`}
                                            onClick={(): void => setActiveIndex(i)}
                                        >
                                            <span className={styles.hDot}>{i + 1}</span>
                                            <span className={styles.hDate}>{m.date}</span>
                                        </button>
                                    ))}

                                    <button
                                        ref={markerRefsSetter(milestones.length)}
                                        type="button"
                                        role="tab"
                                        aria-selected={isVisionSlide}
                                        className={`${styles.hMarker} ${isVisionSlide ? styles.hMarkerActive : ''}`}
                                        onClick={(): void => setActiveIndex(milestones.length)}
                                    >
                                        <span className={`${styles.hDot} ${styles.hDotVision}`}>V</span>
                                        <span className={styles.hDate}>Vision</span>
                                    </button>
                                </div>
                            </div>

                            <div className={styles.hScroller} ref={scrollerRef}>
                                {milestones.map((m, i) => (
                                    <div
                                        key={m.id}
                                        data-index={i}
                                        ref={cardRefsSetter(i)}
                                        className={`${styles.hCard} ${i === activeIndex ? styles.hCardActive : ''}`}
                                    >
                                        <div className={styles.detailHeader}>
                                            <span className={`${styles.statusBadge} ${styles[m.status]}`}>{m.status}</span>
                                            <span className={styles.detailDate}>{m.date}</span>
                                        </div>
                                        <h3 className={styles.detailTitle}>{m.title}</h3>
                                        {m.specs && (
                                            <div className={styles.detailSpecs}>
                                                <span>{m.specs}</span>
                                            </div>
                                        )}
                                        <p className={styles.detailDesc}>{m.description}</p>
                                    </div>
                                ))}

                                <div
                                    data-index={milestones.length}
                                    ref={cardRefsSetter(milestones.length)}
                                    className={`${styles.hCard} ${styles.visionDetail} ${isVisionSlide ? styles.hCardActive : ''}`}
                                >
                                    <div className={styles.visionCards}>
                                        {visionItems.map((item) => (
                                            <div key={item.year} className={styles.visionCard}>
                                                <span className={styles.visionYear}>{item.year}</span>
                                                <h4 className={styles.visionName}>{item.name}</h4>
                                                <p className={styles.visionDesc}>{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.content}>
                            {/* Left - Timeline Navigation */}
                            <div className={styles.timelineNav} role="tablist" aria-label="Roadmap timeline">
                                <div className={styles.track}>
                                    <motion.div
                                        className={styles.progress}
                                        style={progressStyle}
                                    />
                                </div>
                                <div className={styles.markers}>
                                    {milestones.map((m, i) => (
                                        <button
                                            type="button"
                                            key={m.id}
                                            role="tab"
                                            aria-selected={i === activeIndex}
                                            className={`${styles.markerItem} ${i === activeIndex ? styles.active : ''} ${i < activeIndex ? styles.completed : ''}`}
                                            onClick={(): void => handleTabClick(i)}
                                        >
                                            <div className={`${styles.markerDot} ${styles[m.status]}`}>
                                                {m.status === 'completed' && i < activeIndex ? (
                                                    <CheckIcon size={14} />
                                                ) : m.status === 'current' ? (
                                                    <motion.div
                                                        className={styles.pulseInner}
                                                        animate={
                                                            prefersReducedMotion
                                                                ? {}
                                                                : { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }
                                                        }
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    />
                                                ) : (
                                                    <span>{i + 1}</span>
                                                )}
                                            </div>
                                            <span className={styles.markerLabel}>{m.date}</span>
                                        </button>
                                    ))}
                                    {/* Vision marker */}
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={isVisionSlide}
                                        className={`${styles.markerItem} ${isVisionSlide ? styles.active : ''}`}
                                        onClick={(): void => handleTabClick(milestones.length)}
                                    >
                                        <div className={`${styles.markerDot} ${styles.vision}`}>
                                            <LayersIcon size={14} />
                                        </div>
                                        <span className={styles.markerLabel}>Vision</span>
                                    </button>
                                </div>
                            </div>

                            {/* Center - Details */}
                            <div className={styles.details} role="tabpanel">
                                <AnimatePresence mode="wait">
                                    {!isVisionSlide && currentMilestone ? (
                                        <motion.div
                                            key={currentMilestone.id}
                                            className={styles.detail}
                                            variants={slideChange}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: prefersReducedMotion ? 0.01 : 0.4, ease: EASE_OUT_EXPO }}
                                        >
                                            <div className={styles.detailHeader}>
                                                <span className={`${styles.statusBadge} ${styles[currentMilestone.status]}`}>{currentMilestone.status}</span>
                                                <span className={styles.detailDate}>{currentMilestone.date}</span>
                                            </div>
                                            <h3 className={styles.detailTitle}>{currentMilestone.title}</h3>
                                            {currentMilestone.specs && (
                                                <div className={styles.detailSpecs}>
                                                    <span>{currentMilestone.specs}</span>
                                                </div>
                                            )}
                                            <p className={styles.detailDesc}>{currentMilestone.description}</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="vision"
                                            className={styles.visionDetail}
                                            variants={slideChange}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: prefersReducedMotion ? 0.01 : 0.4, ease: EASE_OUT_EXPO }}
                                        >
                                            <div className={styles.visionCards}>
                                                {visionItems.map((item, i) => (
                                                    <motion.div
                                                        key={item.year}
                                                        className={styles.visionCard}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{
                                                            delay: prefersReducedMotion ? 0 : 0.1 + i * 0.15,
                                                            duration: prefersReducedMotion ? 0.01 : 0.4,
                                                        }}
                                                    >
                                                        <span className={styles.visionYear}>{item.year}</span>
                                                        <h4 className={styles.visionName}>{item.name}</h4>
                                                        <p className={styles.visionDesc}>{item.desc}</p>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Right - 3D Model */}
                            <div className={styles.modelContainer}>
                                <ErrorBoundary FallbackComponent={ErrorFallback}>
                                    <Suspense fallback={
                                        <div className={styles.modelLoading}>
                                            <div className={styles.modelLoadingSpinner} />
                                        </div>
                                    }>
                                        <RocketModel />
                                    </Suspense>
                                </ErrorBoundary>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
