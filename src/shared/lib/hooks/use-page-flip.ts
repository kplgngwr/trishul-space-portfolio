import { useRef, type RefObject } from 'react';
import { useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useReducedMotion } from './use-reduced-motion';

/**
 * Stacked card animation values returned by the hook
 */
export interface StackedCardValues {
    /** Reference to attach to the section element */
    ref: RefObject<HTMLElement | null>;
    /** Scale value - shrinks as section scrolls away */
    scale: MotionValue<number>;
    /** Y translation - for entry animation */
    y: MotionValue<number>;
    /** Opacity for visibility */
    opacity: MotionValue<number>;
    /** Whether reduced motion is preferred */
    prefersReducedMotion: boolean;
}

/**
 * Configuration options for the stacked card effect
 */
export interface UsePageFlipOptions {
    /** Index of this card in the stack (0 = first/bottom) */
    index?: number;
    /** Total number of cards */
    total?: number;
    /** Scroll offset configuration */
    offset?: [string, string];
}

/**
 * usePageFlip Hook
 * @description Creates scroll-linked stacked card animation values
 * 
 * The animation creates a "dropping card" effect where:
 * - Current section shrinks and moves back as user scrolls
 * - New section slides up from bottom and covers the previous one
 * - Cards stack on top of each other like a deck
 */
export function usePageFlip(options: UsePageFlipOptions = {}): StackedCardValues {
    const {
        offset = ['start start', 'end start'],
    } = options;

    const ref = useRef<HTMLElement>(null);
    const prefersReducedMotion = useReducedMotion();

    // Track scroll progress of this section
    // Progress goes from 0 (section at top) to 1 (section scrolled past)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: offset as ["start start", "end start"],
    });

    // Scale down as section scrolls away (1 → 0.85)
    // This creates the "stepping back" effect
    const scale = useTransform(
        scrollYProgress,
        [0, 1],
        prefersReducedMotion ? [1, 1] : [1, 0.85]
    );

    // Y translation - section moves up slightly as it shrinks
    // Creates subtle parallax depth effect
    const y = useTransform(
        scrollYProgress,
        [0, 1],
        prefersReducedMotion ? [0, 0] : [0, -50]
    );

    // Slight opacity reduction for depth
    const opacity = useTransform(
        scrollYProgress,
        [0, 0.8, 1],
        prefersReducedMotion ? [1, 1, 1] : [1, 1, 0.6]
    );

    return {
        ref,
        scale,
        y,
        opacity,
        prefersReducedMotion,
    };
}
