import { useMemo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
    Button,
    ArrowRightIcon,
    BuildingIcon,
    LocationIcon,
} from '@/shared/ui';
import { useReducedMotion, EASE_OUT_EXPO } from '@/shared/lib';
import { useOpenJobs } from './useOpenJobs';
import styles from './CareerPage.module.css';

// ============================================================================
// Animation Variants (defined outside component to prevent recreation)
// ============================================================================

const CONTAINER_VARIANTS = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
} as const;

const CONTAINER_VARIANTS_REDUCED = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0 },
    },
} as const;

const ITEM_VARIANTS = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: EASE_OUT_EXPO },
    },
} as const;

const ITEM_VARIANTS_REDUCED = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.01, ease: EASE_OUT_EXPO },
    },
} as const;

// const benefits: Benefit[] = [
//     {
//         icon: <TargetIcon size={20} />,
//         title: 'Mission-Driven Work',
//         description: "Work on cutting-edge space technology that's shaping India's future.",
//     },
//     {
//         icon: <TrendingUpIcon size={20} />,
//         title: 'Growth Opportunities',
//         description: 'Fast-paced startup environment with rapid learning and career advancement.',
//     },
//     {
//         icon: <HeartIcon size={20} />,
//         title: 'Health Benefits',
//         description: 'Comprehensive health insurance coverage for you and your family.',
//     },
//     {
//         icon: <GraduationCapIcon size={20} />,
//         title: 'Learning Budget',
//         description: 'Annual budget for courses, conferences, and skill development.',
//     },
//     {
//         icon: <RocketIcon size={20} />,
//         title: 'Collaborative Culture',
//         description: 'Work alongside brilliant minds from IITs and leading aerospace institutions.',
//     },
//     {
//         icon: <BoltIcon size={20} />,
//         title: 'Work-Life Balance',
//         description: 'Flexible working hours and remote options to maintain your well-being.',
//     },
// ];

// ============================================================================
// Component
// ============================================================================

/**
 * CareerPage Component
 * @description Career opportunities page with job listings by department
 */
export function CareerPage(): ReactNode {
    const prefersReducedMotion = useReducedMotion();
    const { status, departments } = useOpenJobs();

    // Memoized animation variants
    const containerVariants = useMemo(
        () => prefersReducedMotion ? CONTAINER_VARIANTS_REDUCED : CONTAINER_VARIANTS,
        [prefersReducedMotion]
    );

    const itemVariants = useMemo(
        () => prefersReducedMotion ? ITEM_VARIANTS_REDUCED : ITEM_VARIANTS,
        [prefersReducedMotion]
    );

    return (
        <div className={styles.careerPage}>
            <section className={styles.hero}>
                <motion.span
                    className={styles.eyebrow}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.5 }}
                >
                    Join Our Team
                </motion.span>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, delay: 0.1 }}
                >
                    Build the Future of Space
                </motion.h1>
                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, delay: 0.2 }}
                >
                    We're looking for passionate engineers and innovators to help us revolutionize
                    rocket propulsion technology. Join a team that's pushing the boundaries of what's possible.
                </motion.p>
            </section>

            <section className={styles.departments}>
                {status === 'loading' && (
                    <p className={styles.statusMessage}>Loading open positions…</p>
                )}

                {status === 'error' && (
                    <p className={styles.statusMessage}>
                        We couldn't load open positions right now. Please try again shortly, or
                        email your resume to{' '}
                        <a href="mailto:careers@trishulspace.com">careers@trishulspace.com</a>.
                    </p>
                )}

                {status === 'success' && departments.length === 0 && (
                    <p className={styles.statusMessage}>
                        There are no open positions at the moment. Check back soon!
                    </p>
                )}

                {status === 'success' && departments.map((dept, deptIndex) => (
                    <motion.div
                        key={dept.name}
                        className={styles.department}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: prefersReducedMotion ? 0.01 : 0.5,
                            delay: prefersReducedMotion ? 0 : 0.3 + deptIndex * 0.1,
                        }}
                    >
                        <div className={styles.departmentHeader}>
                            <span className={styles.departmentIcon}><BuildingIcon size={24} /></span>
                            <h2 className={styles.departmentTitle}>{dept.name}</h2>
                        </div>

                        <motion.div
                            className={styles.jobsList}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {dept.jobs.map((job) => (
                                <motion.div
                                    key={job.id}
                                    className={styles.jobCard}
                                    variants={itemVariants}
                                >
                                    <div className={styles.jobInfo}>
                                        <h3 className={styles.jobTitle}>{job.title}</h3>
                                        {job.location && (
                                            <div className={styles.jobMeta}>
                                                <span className={styles.tag}>
                                                    <LocationIcon size={12} />
                                                    {job.location}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <a
                                        href={job.applyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.applyBtn}
                                    >
                                        Apply Now
                                        <ArrowRightIcon size={14} />
                                    </a>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                ))}
            </section>

            {/* <section className={styles.benefits}>
                <h2 className={styles.benefitsTitle}>Why Join Trishul Space?</h2>
                <div className={styles.benefitsGrid}>
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            className={styles.benefitCard}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: prefersReducedMotion ? 0.01 : 0.4,
                                delay: prefersReducedMotion ? 0 : 0.5 + index * 0.1,
                            }}
                        >
                            <span className={styles.benefitIcon}>{benefit.icon}</span>
                            <div className={styles.benefitContent}>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section> */}

            <section className={styles.cta}>
                <h2 className={styles.ctaTitle}>Don't see the right role?</h2>
                <p className={styles.ctaText}>
                    We're always looking for talented people. Send us your resume and we'll
                    keep you in mind for future opportunities.
                </p>
                <Button
                    as="a"
                    href="mailto:careers@trishulspace.com"
                    variant="primary"
                    icon={<ArrowRightIcon size={16} />}
                >
                    Send Your Resume
                </Button>
            </section>
        </div>
    );
}
