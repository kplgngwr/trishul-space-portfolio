import { useRef, useState, useCallback, type RefObject, type MouseEvent } from 'react';
import { useReducedMotion } from './use-reduced-motion';

interface UseTiltHoverOptions {
    /** Maximum tilt angle in degrees */
    maxTilt?: number;
    /** Perspective depth in pixels */
    perspective?: number;
    /** Scale on hover */
    scale?: number;
    /** Transition speed in ms */
    speed?: number;
}

interface TiltStyle {
    transform: string;
    transition: string;
}

interface UseTiltHoverReturn<T extends HTMLElement> {
    ref: RefObject<T | null>;
    style: TiltStyle;
    onMouseMove: (e: MouseEvent<T>) => void;
    onMouseLeave: () => void;
}

/**
 * useTiltHover Hook
 * @description Applies 3D perspective tilt effect on hover
 */
export function useTiltHover<T extends HTMLElement = HTMLDivElement>({
    maxTilt = 10,
    perspective = 1000,
    scale = 1.02,
    speed = 300,
}: UseTiltHoverOptions = {}): UseTiltHoverReturn<T> {
    const ref = useRef<T | null>(null);
    const prefersReducedMotion = useReducedMotion();
    const [style, setStyle] = useState<TiltStyle>({
        transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
        transition: `transform ${speed}ms ease-out`,
    });

    const handleMouseMove = useCallback(
        (e: MouseEvent<T>): void => {
            if (prefersReducedMotion || !ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate mouse position relative to center (-1 to 1)
            const mouseX = (e.clientX - centerX) / (rect.width / 2);
            const mouseY = (e.clientY - centerY) / (rect.height / 2);

            // Apply tilt (inverted Y for natural feel)
            const tiltX = -mouseY * maxTilt;
            const tiltY = mouseX * maxTilt;

            setStyle({
                transform: `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`,
                transition: `transform 100ms ease-out`,
            });
        },
        [maxTilt, perspective, scale, prefersReducedMotion]
    );

    const handleMouseLeave = useCallback((): void => {
        setStyle({
            transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
            transition: `transform ${speed}ms ease-out`,
        });
    }, [perspective, speed]);

    return {
        ref,
        style,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
    };
}
