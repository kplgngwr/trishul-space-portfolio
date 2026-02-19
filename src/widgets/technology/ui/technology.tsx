import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useTransform,
    animate,
} from 'framer-motion';
import { products, type Product } from '@/entities/product';
import { Button, PlayIcon, CloseIcon } from '@/shared/ui';
import { useReducedMotion, EASE_OUT_EXPO } from '@/shared/lib';
import styles from './technology.module.css';

/**
 * Technology Widget
 * @description Scroll-driven product showcase with sticky scroll behavior and tab navigation
 */
export function Technology(): ReactNode {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [playingVideo, setPlayingVideo] = useState<{ productId: string; videoType: 'engine' | 'ignitor' } | null>(null);
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
    const prefersReducedMotion = useReducedMotion();

    // Progress value that can be controlled manually when tabs change
    const progressValue = useMotionValue(0);

    // Transform progress to percentage for the bar height
    const lineProgress = useTransform(progressValue, [0, 1], ['0%', '100%']);

    const handleTabClick = useCallback((index: number): void => {
        if (!containerRef.current) return;

        setActiveIndex(index);
        setPlayingVideo(null);
        setIsAutoPlay(false);

        // Clear any existing auto-play timer
        if (autoPlayTimerRef.current) {
            clearTimeout(autoPlayTimerRef.current);
        }

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

        // Set up auto-play timer for 3 seconds
        autoPlayTimerRef.current = setTimeout(() => {
            const product = products[index];
            if (product?.video || product?.ignitorVideo) {
                const videoType = product.video ? 'engine' : 'ignitor';
                setPlayingVideo({ productId: product.id, videoType });
                setIsAutoPlay(true);
            }
        }, 3000); // 3 seconds
    }, [prefersReducedMotion, progressValue]);

    const handleWatchVideo = (productId: string, videoType: 'engine' | 'ignitor' = 'engine'): void => {
        // Clear any existing auto-play timer
        if (autoPlayTimerRef.current) {
            clearTimeout(autoPlayTimerRef.current);
        }
        setPlayingVideo({ productId, videoType });
        setIsAutoPlay(false); // Manual play - loop enabled
    };

    const handleCloseVideo = (): void => {
        setPlayingVideo(null);
        setIsAutoPlay(false);
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (autoPlayTimerRef.current) {
                clearTimeout(autoPlayTimerRef.current);
            }
        };
    }, []);

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
                                                        <div className={styles.videoButtons}>
                                                            {product.video && (
                                                                <button
                                                                    type="button"
                                                                    className={styles.watchBtn}
                                                                    onClick={(e): void => {
                                                                        e.stopPropagation();
                                                                        handleWatchVideo(product.id, 'engine');
                                                                    }}
                                                                >
                                                                    <PlayIcon size={16} />
                                                                    Engine Test
                                                                </button>
                                                            )}
                                                            {product.ignitorVideo && (
                                                                <button
                                                                    type="button"
                                                                    className={styles.watchBtn}
                                                                    onClick={(e): void => {
                                                                        e.stopPropagation();
                                                                        handleWatchVideo(product.id, 'ignitor');
                                                                    }}
                                                                >
                                                                    <PlayIcon size={16} />
                                                                    Ignitor Test
                                                                </button>
                                                            )}
                                                            {!product.video && !product.ignitorVideo && (
                                                                <div className={styles.videoNote}>Engine under development</div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </li>
                                    );
                                })}
                            </ul>

                            <Button
                                as="a"
                                href="/product"
                                variant="primary"
                                className={styles.cta}
                            >
                                Explore Products
                            </Button>
                        </div>

                        {/* Right Side - Media */}
                        <div className={styles.mediaContainer}>
                            <div className={styles.mediaWrapper}>
                                <div className={styles.progressTrack}>
                                    <motion.div
                                        className={styles.progressFill}
                                        style={{ height: lineProgress }}
                                    />
                                </div>

                                <div className={styles.mediaStack}>
                                    {products.map((product, index) => (
                                        <MediaItem
                                            key={product.id}
                                            product={product}
                                            isActive={index === activeIndex}
                                            playingVideo={playingVideo}
                                            isAutoPlay={isAutoPlay}
                                            onCloseVideo={handleCloseVideo}
                                            prefersReducedMotion={prefersReducedMotion}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}

interface MediaItemProps {
    product: Product;
    isActive: boolean;
    playingVideo: { productId: string; videoType: 'engine' | 'ignitor' } | null;
    isAutoPlay: boolean;
    onCloseVideo: () => void;
    prefersReducedMotion: boolean;
}

function MediaItem({
    product,
    isActive,
    playingVideo,
    isAutoPlay,
    onCloseVideo,
    prefersReducedMotion,
}: MediaItemProps): ReactNode {
    const isVideoPlaying = playingVideo?.productId === product.id;
    const videoSrc = playingVideo?.videoType === 'ignitor' ? product.ignitorVideo : product.video;
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleVideoEnd = useCallback(() => {
        if (isAutoPlay) {
            onCloseVideo();
        }
    }, [isAutoPlay, onCloseVideo]);

    return (
        <motion.div
            className={`${styles.mediaItem} ${isActive ? styles.mediaActive : ''}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.96 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
        >
            <img
                src={product.image}
                alt={product.name}
                className={`${styles.mediaImage} ${isVideoPlaying ? styles.hidden : ''}`}
            />

            <AnimatePresence>
                {isVideoPlaying && videoSrc && (
                    <motion.div
                        className={styles.videoOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
                    >
                        <video
                            ref={videoRef}
                            className={`${styles.mediaVideo} ${product.id === 'sharv' ? styles.videoFlipped : ''}`}
                            autoPlay
                            loop={false}
                            muted
                            playsInline
                            onEnded={handleVideoEnd}
                        >
                            <source src={videoSrc} type="video/mp4" />
                        </video>
                        <button
                            type="button"
                            className={styles.closeBtn}
                            onClick={onCloseVideo}
                            aria-label="Close video"
                        >
                            <CloseIcon size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
