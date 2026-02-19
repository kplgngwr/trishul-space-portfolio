import type { Variants, Transition } from 'framer-motion';

/**
 * Standard Framer Motion Animation Variants
 * @description Centralized animation definitions for consistency
 */

// Standard easing curves
export const EASE_OUT_EXPO: Transition['ease'] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT: Transition['ease'] = [0.65, 0, 0.35, 1];

// Fade in up - most common entrance animation
export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: EASE_OUT_EXPO },
    },
};

// Simple fade in
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.4 },
    },
};

// Fade in from left
export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: EASE_OUT_EXPO },
    },
};

// Fade in from right
export const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: EASE_OUT_EXPO },
    },
};

// Scale fade - for cards and badges
export const scaleFade: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: EASE_OUT_EXPO },
    },
};

// Stagger container - wraps children with staggered animations
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

// Fast stagger - for quick sequences
export const fastStaggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.1,
        },
    },
};

// Slide change - for content transitions
export const slideChange: Variants = {
    initial: { opacity: 0, y: 60, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -40, scale: 0.98 },
};

// Reduced motion variants - instant transitions
export const reducedMotionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.01 } },
};

/**
 * Get animation variants based on reduced motion preference
 */
export function getVariants(
    standardVariants: Variants,
    prefersReducedMotion: boolean
): Variants {
    return prefersReducedMotion ? reducedMotionVariants : standardVariants;
}

/**
 * Transition presets
 */
export const transitions = {
    spring: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
    },
    smooth: {
        duration: 0.5,
        ease: EASE_OUT_EXPO,
    },
    fast: {
        duration: 0.3,
        ease: EASE_OUT_EXPO,
    },
} as const;
