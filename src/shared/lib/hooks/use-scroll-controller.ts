import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to handle scroll behavior and global class management based on routes
 */
export function useScrollController(): void {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const html = document.documentElement;

        // Scroll to top on route change
        window.scrollTo(0, 0);

        if (isHomePage) {
            html.classList.add('home-page');
        } else {
            html.classList.remove('home-page');
        }

        // Cleanup on unmount
        return () => {
            html.classList.remove('home-page');
        };
    }, [isHomePage, location.pathname]);
}
