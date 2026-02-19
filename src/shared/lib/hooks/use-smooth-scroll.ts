import { useCallback } from 'react';

/**
 * Custom hook for smooth scroll navigation that bypasses scroll-snap trapping
 * @description Temporarily disables scroll-snap during programmatic navigation
 * to prevent the scroll from getting stuck at intermediate snap points
 */
export function useSmoothScroll(): (targetId: string) => void {
    const scrollToTarget = useCallback((targetId: string): void => {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const htmlElement = document.documentElement;
        const originalScrollSnapType = htmlElement.style.scrollSnapType;

        // Temporarily disable scroll-snap to allow smooth navigation
        htmlElement.style.scrollSnapType = 'none';

        // Calculate target position accounting for fixed header
        const headerHeight = 56;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

        // Perform smooth scroll
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
        });

        // Re-enable scroll-snap after scroll completes
        // Use a timeout based on typical smooth scroll duration
        const scrollDuration = 800;
        setTimeout((): void => {
            htmlElement.style.scrollSnapType = originalScrollSnapType;
        }, scrollDuration);
    }, []);

    return scrollToTarget;
}
