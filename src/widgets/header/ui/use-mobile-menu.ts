import { useState, useCallback } from 'react';

interface UseMobileMenuResult {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
    open: () => void;
}

/**
 * Mobile Menu State Hook
 */
export function useMobileMenu(): UseMobileMenuResult {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggle = useCallback((): void => {
        setIsOpen((prev) => !prev);
    }, []);

    const close = useCallback((): void => {
        setIsOpen(false);
    }, []);

    const open = useCallback((): void => {
        setIsOpen(true);
    }, []);

    return { isOpen, toggle, close, open };
}
