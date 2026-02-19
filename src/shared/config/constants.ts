/**
 * Shared Configuration Constants
 * @description Business-agnostic configuration values
 */

export const HEADER_HEIGHT = {
    desktop: 56,
    mobile: 48,
} as const;

export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
} as const;

export const ANIMATION = {
    duration: {
        fast: 0.15,
        base: 0.3,
        slow: 0.5,
        spring: 0.6,
    },
    ease: {
        out: [0.16, 1, 0.3, 1] as const,
        inOut: [0.65, 0, 0.35, 1] as const,
    },
} as const;

export const NAV_ITEMS = [
    { label: 'Product', href: '/product' },
    { label: 'Team', href: '/team' },
    { label: 'Press Release', href: '/blogs' },
    { label: 'Career', href: '/career' }
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

