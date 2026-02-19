import { type ReactNode } from 'react';
import { motion, type MotionValue, useTransform } from 'framer-motion';
import { Button, BoltIcon } from '@/shared/ui';
import { fadeInUp, staggerContainer, scaleFade } from '@/shared/lib';
import { StatItem } from './StatItem';
import styles from './hero.module.css';

interface HeroContentProps {
    scrollYProgress: MotionValue<number>;
    prefersReducedMotion: boolean;
}

export function HeroContent({ scrollYProgress, prefersReducedMotion }: HeroContentProps): ReactNode {
    // Parallax transforms
    const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <motion.div
            className={styles.content}
            style={prefersReducedMotion ? {} : { y: contentY, opacity: contentOpacity }}
        >
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                {/* Logo */}
                <motion.div className={styles.logoContainer} variants={fadeInUp}>
                    <img src="/logo.png" alt="Trishul Space" className={styles.logo} />
                </motion.div>

                {/* Headline */}
                <motion.div className={styles.headerContainer} variants={fadeInUp}>
                    <h1 className={styles.mainHeader}>
                        <span>Propelling the future</span>
                        <span>of space propulsion</span>
                    </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.p className={styles.subtitle} variants={fadeInUp}>
                    Indigenous, Efficient, Modular Liquid Rocket Engines for the next
                    generation of launch vehicles
                </motion.p>

                {/* CTA Buttons */}
                <motion.div className={styles.ctaRow} variants={fadeInUp}>
                    <Button
                        as="a"
                        href="#technology"
                        variant="primary"
                        size="lg"
                        icon={<BoltIcon />}
                        iconPosition="left"
                    >
                        Explore Harpy-1
                    </Button>
                    <Button as="a" href="/contact" variant="secondary" size="lg">
                        Request specifications
                    </Button>
                </motion.div>

                {/* Stats with Count-up Animation */}
                <motion.div
                    className={styles.statsRow}
                    variants={staggerContainer}
                >
                    <StatItem
                        end={348}
                        suffix="s"
                        label="Specific Impulse"
                    />
                    <StatItem
                        end={37}
                        suffix=" kN"
                        label="Vacuum Thrust"
                        duration={1800}
                    />
                    <motion.div className={styles.statBadge} variants={scaleFade}>
                        <span className={styles.statValue}>Methalox</span>
                        <span className={styles.statLabel}>Green Propulsion</span>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
