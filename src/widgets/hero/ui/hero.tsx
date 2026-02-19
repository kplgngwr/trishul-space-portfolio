import { useRef, useState, useEffect, type ReactNode, type MouseEvent } from 'react';
import { useScroll, useMotionValue } from 'framer-motion';
import { useReducedMotion } from '@/shared/lib';
import { SwipeRipple } from './SwipeRipple';
import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';
import styles from './hero.module.css';

/**
 * Hero Widget
 * @description Main landing section with parallax effects and animated stats
 */
export function Hero(): ReactNode {
    const sectionRef = useRef<HTMLElement | null>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const prefersReducedMotion = useReducedMotion();
    const [isHovering, setIsHovering] = useState(false);

    // Motion Values for high-performance mouse tracking (no re-renders)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Scroll-based parallax
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    // Cache rect on mount and resize
    useEffect(() => {
        const updateRect = () => {
            if (sectionRef.current) {
                rectRef.current = sectionRef.current.getBoundingClientRect();
            }
        };

        updateRect();
        window.addEventListener('resize', updateRect);

        // Also update on scroll since the element position relative to viewport changes?
        // Actually for mouseX/Y relative to element, we need client rect.
        // If element scrolls, client rect changes.
        // BUT, we are calculating 'x' and 'y' relative to the element top-left.
        // The event gives clientX/Y.
        // So x = clientX - rect.left.
        // If we scroll, rect.left might behave differently if sticky. 
        // But Hero is usually static at top. 
        // However, to be safe, we can update rect on mouseenter.

        return () => window.removeEventListener('resize', updateRect);
    }, []);

    const onMouseEnter = () => {
        setIsHovering(true);
        // FORCE update rect on enter to ensure accuracy
        if (sectionRef.current) {
            rectRef.current = sectionRef.current.getBoundingClientRect();
        }
    };

    // Handle mouse move for swipe effect with MotionValues
    const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
        if (!rectRef.current) return;

        // Use cached rect
        const x = e.clientX - rectRef.current.left;
        const y = e.clientY - rectRef.current.top;

        mouseX.set(x);
        mouseY.set(y);
    };

    return (
        <section
            className={styles.hero}
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={() => setIsHovering(false)}
        >
            <HeroBackground
                scrollYProgress={scrollYProgress}
                prefersReducedMotion={prefersReducedMotion}
            />

            {/* Flashlight Glow Effect */}
            <SwipeRipple
                mouseX={mouseX}
                mouseY={mouseY}
                isHovering={isHovering}
            />

            <HeroContent
                scrollYProgress={scrollYProgress}
                prefersReducedMotion={prefersReducedMotion}
            />
        </section>
    );
}
