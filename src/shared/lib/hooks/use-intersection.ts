import { useEffect, useRef, useState, type RefObject } from 'react';

interface UseIntersectionOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

interface UseIntersectionResult<T extends Element> {
    ref: RefObject<T | null>;
    isIntersecting: boolean;
    hasIntersected: boolean;
}

/**
 * Custom hook for IntersectionObserver
 * @description Replaces duplicated observer logic across components
 */
export function useIntersection<T extends Element = HTMLElement>(
    options: UseIntersectionOptions = {}
): UseIntersectionResult<T> {
    const { threshold = 0.2, rootMargin = '0px', triggerOnce = true } = options;
    const ref = useRef<T | null>(null);
    const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
    const [hasIntersected, setHasIntersected] = useState<boolean>(false);

    useEffect((): (() => void) => {
        const element = ref.current;

        // Early exit if element doesn't exist or already triggered (for triggerOnce mode)
        if (!element || (triggerOnce && hasIntersected)) {
            return (): void => { };
        }

        const observer = new IntersectionObserver(
            ([entry]: IntersectionObserverEntry[]): void => {
                const isVisible = entry.isIntersecting;
                setIsIntersecting(isVisible);

                if (isVisible && !hasIntersected) {
                    setHasIntersected(true);
                    if (triggerOnce) {
                        observer.disconnect();
                    }
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);
        return (): void => observer.disconnect();
        // Note: hasIntersected is intentionally NOT in dependencies to avoid observer recreation
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threshold, rootMargin, triggerOnce]);

    return { ref, isIntersecting, hasIntersected };
}

