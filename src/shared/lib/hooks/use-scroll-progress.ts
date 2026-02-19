import { useEffect, useState, useCallback, type RefObject } from 'react';

interface ScrollProgressOptions {
    offset?: [string, string];
}

interface ScrollProgressResult {
    progress: number;
}

/**
 * Hook to track scroll progress within a container
 * @description Alternative to Framer Motion useScroll for simpler cases
 */
export function useScrollProgress(
    containerRef: RefObject<HTMLElement | null>,
    options: ScrollProgressOptions = {}
): ScrollProgressResult {
    const { offset = ['start start', 'end end'] } = options;
    const [progress, setProgress] = useState<number>(0);

    const calculateProgress = useCallback((): void => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Parse offset to determine start and end positions
        const [startOffset] = offset;
        const isStartStart = startOffset === 'start start';

        let scrollProgress: number;

        if (isStartStart) {
            // When container top hits viewport top to when container bottom hits viewport bottom
            const containerHeight = rect.height;
            const scrollableDistance = containerHeight - windowHeight;

            if (scrollableDistance <= 0) {
                scrollProgress = rect.top <= 0 ? 1 : 0;
            } else {
                scrollProgress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
            }
        } else {
            // Default: container enters to container leaves
            const start = windowHeight;
            const end = -rect.height;
            const current = rect.top;
            scrollProgress = Math.max(0, Math.min(1, (start - current) / (start - end)));
        }

        setProgress(scrollProgress);
    }, [containerRef, offset]);

    useEffect((): (() => void) => {
        // Schedule initial calculation to avoid synchronous setState in effect body
        const initialFrame = requestAnimationFrame(calculateProgress);

        const handleScroll = (): void => {
            requestAnimationFrame(calculateProgress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });

        return (): void => {
            cancelAnimationFrame(initialFrame);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [calculateProgress]);

    return { progress };
}
