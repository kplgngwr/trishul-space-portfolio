import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { founders, mentors, type TeamMember } from '@/entities/team-member';
import {
    useIntersection,
    useReducedMotion,
    fadeInUp,
    staggerContainer,
    scaleFade,
    getVariants,
} from '@/shared/lib';
import styles from './team.module.css';

const MEMBER_IMAGES: Record<string, string> = {
    'Aditya Singh': '/Aditya.png',
    'Divyam' : '/Divyam.jpeg',
    'Rajat Choudhary': '/Rajat.png',
    'Dr. Rajesh Sanghi': '/sanghi.png',
    'Dr. Hardip Rai': '/hardip.png',
    'Prof. Ashok Jhunjhunwala': '/ashok.png',
};

export function TeamSection(): ReactNode {
    const { ref, hasIntersected } = useIntersection<HTMLElement>({ threshold: 0.2 });
    const prefersReducedMotion = useReducedMotion();

    const variants = {
        fadeInUp: getVariants(fadeInUp, prefersReducedMotion),
        staggerContainer: getVariants(staggerContainer, prefersReducedMotion),
        scaleFade: getVariants(scaleFade, prefersReducedMotion),
    };

    const renderCards = (members: TeamMember[]) => (
        <motion.div className={styles.grid} variants={variants.staggerContainer}>
            {members.map((member) => (
                <motion.article
                    key={member.name}
                    className={styles.card}
                    variants={variants.scaleFade}
                >
                    <div className={styles.avatar}>
                        {MEMBER_IMAGES[member.name] ? (
                            <img
                                src={MEMBER_IMAGES[member.name]}
                                alt={member.name}
                                className={styles.avatarImage}
                            />
                        ) : (
                            <span>
                                {member.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </span>
                        )}
                    </div>
                    <div className={styles.cardContent}>
                        <h4 className={styles.name}>{member.name}</h4>
                        <span className={styles.role}>{member.role}</span>
                    </div>
                </motion.article>
            ))}
        </motion.div>
    );

    return (
        <section id="team" className={styles.section} ref={ref}>
            <div className="container">
                <motion.div
                    initial="hidden"
                    animate={hasIntersected ? 'visible' : 'hidden'}
                    variants={variants.staggerContainer}
                >
                    <motion.header className={styles.header} variants={variants.fadeInUp}>
                        <span className="section-eyebrow">Our Team</span>
                        <h2 className={styles.title}>
                            Engineering Agility Meets Institutional Wisdom
                        </h2>
                        <p className={styles.description}>
                            A compelling synthesis of youthful ambition and seasoned expertise,
                            positioned to execute in the high-stakes aerospace sector.
                        </p>
                    </motion.header>

                    <div className={styles.group}>
                        <motion.h3 className={styles.groupTitle} variants={variants.fadeInUp}>
                            Founding Team
                        </motion.h3>
                        {renderCards(founders)}
                    </div>

                    {/* <div className={styles.group}>
                        <motion.h3 className={styles.groupTitle} variants={variants.fadeInUp}>
                            Mentors
                        </motion.h3>
                        {renderCards(mentors)}
                    </div> */}
                </motion.div>
            </div>
        </section>
    );
}
