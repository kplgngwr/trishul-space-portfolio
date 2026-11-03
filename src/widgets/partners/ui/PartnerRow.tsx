import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import type { Partner } from '@/entities/partner';
import { ArrowLeftIcon, ArrowRightIcon } from '@/shared/ui';
import styles from './partners.module.css';

interface PartnerRowProps {
    label: string;
    partners: Partner[];
    listVariants: Variants;
    cardVariants: Variants;
}

/**
 * PartnerRow
 * @description Single-line, horizontally scrollable list of partner cards.
 * Arrows appear on hover only when the row overflows in that direction.
 */
export function PartnerRow({ label, partners, listVariants, cardVariants }: PartnerRowProps): ReactNode {
    const trackRef = useRef<HTMLDivElement>(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const updateScrollState = useCallback((): void => {
        const track = trackRef.current;
        if (!track) return;
        setCanScrollPrev(track.scrollLeft > 1);
        setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 1);
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        updateScrollState();
        const observer = new ResizeObserver(updateScrollState);
        observer.observe(track);
        track.addEventListener('scroll', updateScrollState, { passive: true });

        return () => {
            observer.disconnect();
            track.removeEventListener('scroll', updateScrollState);
        };
    }, [updateScrollState, partners.length]);

    const scrollByPage = (direction: -1 | 1): void => {
        const track = trackRef.current;
        if (!track) return;
        track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
    };

    const rowClassName = [
        styles.row,
        canScrollPrev ? styles.fadeStart : '',
        canScrollNext ? styles.fadeEnd : '',
    ].join(' ');

    return (
        <div className={rowClassName}>
            <motion.div
                ref={trackRef}
                className={styles.track}
                variants={listVariants}
                role="list"
                aria-label={label}
            >
                {partners.map((partner) => (
                    <motion.a
                        key={partner.name}
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        role="listitem"
                        className={`${styles.card} ${partner.isDark ? styles.darkCard : ''}`}
                        variants={cardVariants}
                    >
                        <div className={styles.logo}>
                            <img src={partner.logo} alt={partner.name} loading="lazy" />
                        </div>
                        <span className={styles.name}>{partner.name}</span>
                    </motion.a>
                ))}
            </motion.div>

            {canScrollPrev && (
                <button
                    type="button"
                    className={`${styles.arrow} ${styles.arrowPrev}`}
                    onClick={(): void => scrollByPage(-1)}
                    aria-label={`Scroll ${label} left`}
                >
                    <ArrowLeftIcon size={18} />
                </button>
            )}
            {canScrollNext && (
                <button
                    type="button"
                    className={`${styles.arrow} ${styles.arrowNext}`}
                    onClick={(): void => scrollByPage(1)}
                    aria-label={`Scroll ${label} right`}
                >
                    <ArrowRightIcon size={18} />
                </button>
            )}
        </div>
    );
}
