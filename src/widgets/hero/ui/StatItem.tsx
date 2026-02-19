import { motion } from 'framer-motion';
import { useCountUp, scaleFade } from '@/shared/lib';
import styles from './hero.module.css';

interface StatItemProps {
    end: number;
    suffix?: string;
    label: string;
    duration?: number;
}

export function StatItem({ end, suffix = '', label, duration = 2000 }: StatItemProps) {
    const { value } = useCountUp({ end, suffix, duration });

    return (
        <motion.div className={styles.statBadge} variants={scaleFade}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
        </motion.div>
    );
}
