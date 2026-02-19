import { useRef, useState, useCallback, type RefObject, type MouseEvent } from 'react';
import { useReducedMotion } from './use-reduced-motion';

interface MousePosition {
    x: number;
    y: number;
    normalizedX: number;
    normalizedY: number;
    velocityX: number;
    velocityY: number;
    velocity: number;
}

interface UseMouseSwipeOptions<T extends HTMLElement = HTMLElement> {
    /** Minimum velocity threshold to trigger ripples */
    velocityThreshold?: number;
    /** Smoothing factor for velocity (0-1, higher = more responsive) */
    smoothing?: number;
    /** Optional external ref to use instead of creating one */
    externalRef?: RefObject<T | null>;
}

interface UseMouseSwipeReturn<T extends HTMLElement> {
    ref: RefObject<T | null>;
    position: MousePosition;
    isHovering: boolean;
    onMouseMove: (e: MouseEvent<T>) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const defaultPosition: MousePosition = {
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    velocityX: 0,
    velocityY: 0,
    velocity: 0,
};

/**
 * useMouseSwipe Hook
 * @description Tracks mouse position and velocity for swipe-based animations
 * @param options.velocityThreshold - Reserved for future use (velocity-based ripple triggering)
 */
export function useMouseSwipe<T extends HTMLElement = HTMLDivElement>({
    smoothing = 0.3,
    externalRef,
}: UseMouseSwipeOptions<T> = {}): UseMouseSwipeReturn<T> {
    const internalRef = useRef<T | null>(null);
    const ref = externalRef ?? internalRef;
    const prefersReducedMotion = useReducedMotion();
    const lastPositionRef = useRef({ x: 0, y: 0, time: 0 });

    const [position, setPosition] = useState<MousePosition>(defaultPosition);
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = useCallback(
        (e: MouseEvent<T>): void => {
            if (prefersReducedMotion || !ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Normalized coordinates (-1 to 1)
            const normalizedX = (x / rect.width) * 2 - 1;
            const normalizedY = (y / rect.height) * 2 - 1;

            // Calculate velocity
            const now = performance.now();
            const dt = now - lastPositionRef.current.time;

            let velocityX = 0;
            let velocityY = 0;

            if (dt > 0 && dt < 100) { // Only calculate if reasonable time gap
                const dx = x - lastPositionRef.current.x;
                const dy = y - lastPositionRef.current.y;
                velocityX = dx / dt * 16; // Normalize to ~60fps
                velocityY = dy / dt * 16;
            }

            // Calculate total velocity magnitude
            const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

            // Update last position
            lastPositionRef.current = { x, y, time: now };

            setPosition(prev => ({
                x,
                y,
                normalizedX,
                normalizedY,
                // Smooth the velocity values
                velocityX: prev.velocityX + (velocityX - prev.velocityX) * smoothing,
                velocityY: prev.velocityY + (velocityY - prev.velocityY) * smoothing,
                velocity: prev.velocity + (velocity - prev.velocity) * smoothing,
            }));
        },
        [prefersReducedMotion, smoothing, ref]
    );

    const handleMouseEnter = useCallback((): void => {
        setIsHovering(true);
    }, []);

    const handleMouseLeave = useCallback((): void => {
        setIsHovering(false);
        // Don't reset position - let the glow fade out in place
        // setPosition(defaultPosition);
    }, []);

    return {
        ref,
        position,
        isHovering,
        onMouseMove: handleMouseMove,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
    };
}
