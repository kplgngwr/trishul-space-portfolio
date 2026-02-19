import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '@/shared/config';
import { Button, ArrowRightIcon, MenuIcon, CloseIcon } from '@/shared/ui';
import { useMobileMenu } from './use-mobile-menu';
import { MobileMenu } from './MobileMenu';
import styles from './header.module.css';

/**
 * Header Widget
 * @description Main navigation header with mobile responsiveness and routing
 */
export function Header(): ReactNode {
    const { isOpen, toggle, close } = useMobileMenu();
    const location = useLocation();

    /**
     * Check if a nav item is active
     */
    const isActive = (href: string): boolean => {
        return location.pathname === href;
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo} aria-label="Trishul Space Home">
                    <img src="/logo.png" alt="Trishul Space" />
                </Link>

                {/* Desktop Navigation */}
                <div className={styles.actions}>
                    <nav className={styles.nav} aria-label="Main navigation">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <Button
                        as="a"
                        href="/contact"
                        variant="primary"
                        size="sm"
                        icon={<ArrowRightIcon size={16} />}
                        className={styles.cta}
                        aria-label="Partner with Trishul Space"
                    > Partner With Us </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    className={styles.menuBtn}
                    onClick={toggle}
                    aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    {isOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
            </div>

            {/* Mobile Menu */}
            <MobileMenu isOpen={isOpen} onClose={close} />
        </header>
    );
}

