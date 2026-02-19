import { useEffect } from 'react';

interface UseHashScrollOptions {
    /** Delay in milliseconds before scrolling (handles async content) */
    delay?: number;
    /** Whether to use smooth scrolling */
    smooth?: boolean;
    /** Offset from top in pixels */
    offset?: number;
    /** Enable logging for debugging */
    debug?: boolean;
}

/**
 * useHashScroll Hook
 * @description Automatically scrolls to elements based on URL hash changes
 * Handles SPA routing, delayed rendering, and prevents memory leaks
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   useHashScroll({ smooth: true, delay: 300 });
 *   return <div id="section">Content</div>;
 * }
 * ```
 */
export function useHashScroll(options: UseHashScrollOptions = {}): void {
    const {
        delay = 0,
        smooth = true,
        offset = 0,
        debug = false,
    } = options;

    useEffect(() => {
        /**
         * Scroll to element by hash
         */
        const scrollToHash = (hash: string): void => {
            // Remove # prefix if present
            const id = hash.replace('#', '');

            if (!id) return;

            if (debug) {
                console.log(`[useHashScroll] Attempting to scroll to: ${id}`);
            }

            // Function to perform the actual scroll
            const performScroll = (): void => {
                const element = document.getElementById(id);

                if (!element) {
                    if (debug) {
                        console.warn(`[useHashScroll] Element with id "${id}" not found`);
                    }
                    return;
                }

                const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset;

                if (debug) {
                    console.log(`[useHashScroll] Scrolling to ${id} at position ${elementPosition}`);
                }

                window.scrollTo({
                    top: elementPosition,
                    behavior: smooth ? 'smooth' : 'auto',
                });
            };

            // Delay scroll to allow for async content rendering
            if (delay > 0) {
                setTimeout(performScroll, delay);
            } else {
                performScroll();
            }
        };

        /**
         * Handle hash change from browser navigation
         */
        const handleHashChange = (): void => {
            const hash = window.location.hash;
            if (hash) {
                scrollToHash(hash);
            }
        };

        /**
         * Handle initial load with hash
         */
        if (window.location.hash) {
            scrollToHash(window.location.hash);
        }

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);

        // Cleanup: Remove event listener to prevent memory leaks
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [delay, smooth, offset, debug]);
}
