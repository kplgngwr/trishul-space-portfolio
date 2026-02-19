import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, ArrowRightIcon, RocketIcon } from '@/shared/ui';
import { useReducedMotion } from '@/shared/lib';
import styles from './NotFoundPage.module.css';

/**
 * NotFoundPage Component
 * @description 404 page for handling invalid routes
 */
export function NotFoundPage(): ReactNode {
    const prefersReducedMotion = useReducedMotion();
    const animDuration = prefersReducedMotion ? 0.01 : 0.5;

    return (
        <div className={styles.notFoundPage}>
            <motion.div
                className={styles.icon}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: animDuration }}
                aria-hidden="true"
            >
                <RocketIcon size={64} />
            </motion.div>

            <motion.h1
                className={styles.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: animDuration, delay: 0.1 }}
            >
                Page Not Found
            </motion.h1>

            <motion.p
                className={styles.subtitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: animDuration, delay: 0.2 }}
            >
                Looks like this rocket went off course. The page you're looking for
                doesn't exist or has been moved.
            </motion.p>

            <motion.div
                className={styles.actions}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: animDuration, delay: 0.3 }}
            >
                <Link to="/">
                    <Button variant="primary" icon={<ArrowRightIcon size={16} />}>
                        Back to Home
                    </Button>
                </Link>
                <Link to="/contact">
                    <Button variant="secondary">
                        Contact Us
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
