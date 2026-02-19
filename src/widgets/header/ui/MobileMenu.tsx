import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '@/shared/config';
import { useReducedMotion } from '@/shared/lib';
import styles from './header.module.css';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps): ReactNode {
    const prefersReducedMotion = useReducedMotion();
    const location = useLocation();

    const isActive = (href: string): boolean => {
        return location.pathname === href;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className={styles.mobileMenu}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{
                            type: 'tween',
                            duration: prefersReducedMotion ? 0.01 : 0.3,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                    >
                        <nav className={styles.mobileNav}>
                            {NAV_ITEMS.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: prefersReducedMotion ? 0 : 0.1 + index * 0.05,
                                        duration: prefersReducedMotion ? 0.01 : 0.3,
                                    }}
                                >
                                    <Link
                                        to={item.href}
                                        className={`${styles.mobileNavItem} ${isActive(item.href) ? styles.mobileNavItemActive : ''}`}
                                        onClick={onClose}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: prefersReducedMotion ? 0 : 0.1 + NAV_ITEMS.length * 0.05,
                                    duration: prefersReducedMotion ? 0.01 : 0.3,
                                }}
                            >
                                <Link
                                    to="/contact"
                                    className={`${styles.mobileNavItem} ${styles.mobileNavCta}`}
                                    onClick={onClose}
                                >
                                    Partner With Us
                                </Link>
                            </motion.div>
                        </nav>
                    </motion.div>

                    <motion.div
                        className={styles.backdrop}
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
                        aria-hidden="true"
                    />
                </>
            )}
        </AnimatePresence>
    );
}
