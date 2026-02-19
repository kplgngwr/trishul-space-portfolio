import { useEffect } from 'react';

/**
 * useCardGlowEffect Hook
 * @description Adds a flashlight glow effect to all cards that follow the mouse cursor.
 * Cards must have the data-glow attribute or be targeted by selector.
 */
export function useCardGlowEffect(): void {
    useEffect(() => {
        // Handle mouse move on cards
        const handleMouseMove = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const card = target.closest('[data-glow], article, .card') as HTMLElement | null;

            if (card) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            }
        };

        // Add global listener
        document.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
}
