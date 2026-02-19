import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from './use-reduced-motion';

interface UseCountUpOptions {
    /** Final value to count to */
    end: number;
    /** Animation duration in milliseconds */
    duration?: number;
    /** Number of decimal places */
    decimals?: number;
    /** Prefix (e.g., "₹") */
    prefix?: string;
    /** Suffix (e.g., "s", " kN") */
    suffix?: string;
    /** Start animation when true */
    shouldStart?: boolean;
}

interface UseCountUpReturn {
    /** Current display value as formatted string */
    value: string;
    /** Whether animation has completed */
    isComplete: boolean;
}

/**
 * useCountUp Hook
 * @description Animates a number from 0 to a target value with easing
 */
export function useCountUp({
    end,
    duration = 2000,
    decimals = 0,
    prefix = '',
    suffix = '',
    shouldStart = true,
}: UseCountUpOptions): UseCountUpReturn {
    const [currentValue, setCurrentValue] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const frameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    // Easing function - easeOutExpo for smooth deceleration
    const easeOutExpo = useCallback((t: number): number => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }, []);

    useEffect(() => {
        // If reduced motion, show final value immediately (but scheduled to avoid sync setState)
        if (prefersReducedMotion || !shouldStart) {
            if (shouldStart) {
                // Schedule state update to avoid synchronous setState in effect body
                const frame = requestAnimationFrame(() => {
                    setCurrentValue(end);
                    setIsComplete(true);
                });
                return () => cancelAnimationFrame(frame);
            }
            return;
        }

        const animate = (timestamp: number): void => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
            }

            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const value = easedProgress * end;

            setCurrentValue(value);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setCurrentValue(end);
                setIsComplete(true);
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [end, duration, shouldStart, prefersReducedMotion, easeOutExpo]);

    // Format the value
    const formattedValue = `${prefix}${currentValue.toFixed(decimals)}${suffix}`;

    return { value: formattedValue, isComplete };
}
