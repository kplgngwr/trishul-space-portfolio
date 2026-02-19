import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LinkedInIcon, TwitterIcon, EmailIcon } from '@/shared/ui';
import {
    useIntersection,
    useReducedMotion,
    fadeInUp,
    staggerContainer,
    scaleFade,
    fadeInLeft,
    getVariants,
} from '@/shared/lib';
import styles from './footer.module.css';

const SOCIAL_LINKS = [
    {
        name: 'LinkedIn',
        href: 'https://linkedin.com/company/trishul-space',
        icon: LinkedInIcon,
        external: true,
    },
    {
        name: 'Twitter',
        href: 'https://twitter.com/trishulspace',
        icon: TwitterIcon,
        external: true,
    },
    {
        name: 'Email',
        href: 'mailto:info@trishulspace.com',
        icon: EmailIcon,
        external: false,
    },
] as const;

const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Technology', href: '/#technology' },
    { label: 'About', href: '/#about' },
    { label: 'Roadmap', href: '/#roadmap' },
] as const;

const COMPANY_LINKS = [
    { label: 'Contact', href: '/contact' },
    { label: 'Team', href: '/team' },
    { label: 'Career', href: '/career' },
] as const;

/**
 * Footer Widget
 * @description Site footer with navigation and social links
 */
export function Footer(): ReactNode {
    const { ref, hasIntersected } = useIntersection<HTMLElement>({ threshold: 0.3 });
    const prefersReducedMotion = useReducedMotion();

    const variants = {
        fadeInUp: getVariants(fadeInUp, prefersReducedMotion),
        fadeInLeft: getVariants(fadeInLeft, prefersReducedMotion),
        staggerContainer: getVariants(staggerContainer, prefersReducedMotion),
        scaleFade: getVariants(scaleFade, prefersReducedMotion),
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer id="contact" className={styles.footer} role="contentinfo" ref={ref}>
            <div className={styles.bgPattern} aria-hidden="true" />
            <div className={styles.gradientOverlay} aria-hidden="true" />

            <div className="container">
                <motion.div
                    className={styles.main}
                    initial="hidden"
                    animate={hasIntersected ? 'visible' : 'hidden'}
                    variants={variants.staggerContainer}
                >
                    {/* Brand */}
                    <motion.div className={styles.brand} variants={variants.fadeInUp}>
                        <div className={styles.logo}>
                            <img src="/logo.png" alt="Trishul Space" />
                        </div>
                        <p className={styles.tagline}>
                            Indigenous liquid rocket engines for the next generation of launch vehicles.
                        </p>

                        {/* Social Links */}
                        <motion.div
                            className={styles.social}
                            variants={variants.staggerContainer}
                        >
                            {SOCIAL_LINKS.map(({ name, href, icon: Icon, external }) => (
                                <motion.a
                                    key={name}
                                    href={href}
                                    className={styles.socialLink}
                                    aria-label={name}
                                    target={external ? '_blank' : undefined}
                                    rel={external ? 'noopener noreferrer' : undefined}
                                    variants={variants.scaleFade}
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Links */}
                    <div className={styles.linksRow}>
                        <motion.div className={styles.linkGroup} variants={variants.fadeInLeft}>
                            <h4 className={styles.linkGroupTitle}>Navigation</h4>
                            {NAV_LINKS.map((link) => (
                                <a key={link.href} href={link.href}>
                                    {link.label}
                                </a>
                            ))}
                        </motion.div>

                        <motion.div className={styles.linkGroup} variants={variants.fadeInLeft}>
                            <h4 className={styles.linkGroupTitle}>Company</h4>
                            {COMPANY_LINKS.map((link) => (
                                <a key={link.href} href={link.href}>
                                    {link.label}
                                </a>
                            ))}
                        </motion.div>

                        <motion.div className={styles.linkGroup} variants={variants.fadeInLeft}>
                            <h4 className={styles.linkGroupTitle}>Location</h4>
                            <p>Registered in Prayagraj</p>
                            <p>R&D at Research & Innovation Park, IIT Delhi</p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Divider */}
                <motion.div
                    className={styles.divider}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={
                        hasIntersected
                            ? { scaleX: 1, opacity: 1 }
                            : { scaleX: 0, opacity: 0 }
                    }
                    transition={{
                        duration: prefersReducedMotion ? 0.01 : 0.8,
                        delay: prefersReducedMotion ? 0 : 0.4,
                    }}
                    style={{ transformOrigin: 'left center' }}
                />

                {/* Bottom */}
                <motion.div
                    className={styles.bottom}
                    initial="hidden"
                    animate={hasIntersected ? 'visible' : 'hidden'}
                    variants={variants.fadeInUp}
                >
                    <p className={styles.copyright}>
                        © {currentYear} Trishul Technology Private Limited. All rights reserved.
                    </p>
                    <a href="mailto:info@trishulspace.com" className={styles.email}>
                        info@trishulspace.com
                    </a>
                </motion.div>
            </div>
        </footer>
    );
}
