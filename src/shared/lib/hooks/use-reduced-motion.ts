import { useEffect, useState } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * @description For accessibility - respects prefers-reduced-motion setting
 */
export function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
        (): boolean => {
            if (typeof window === 'undefined') return false;
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
    );

    useEffect((): (() => void) => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const handleChange = (event: MediaQueryListEvent): void => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return (): void => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReducedMotion;
}
