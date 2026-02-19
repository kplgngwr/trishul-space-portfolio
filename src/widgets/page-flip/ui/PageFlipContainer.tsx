import type { ReactNode, ReactElement, Key } from 'react';
import { Children, cloneElement, isValidElement } from 'react';
import styles from './page-flip.module.css';

/**
 * Props for StackedCard component
 */
interface StackedCardProps {
    children: ReactNode;
    index: number;
    /** If true, this section has its own scroll animation and needs special handling */
    hasInternalScroll?: boolean;
}

/**
 * StackedCard Component
 * @description Individual card in the stack with CSS-only sticky stacking effect
 */
function StackedCard({ children, index, hasInternalScroll }: StackedCardProps): ReactNode {

    // For sections with internal scroll, we don't use sticky positioning
    // to avoid interfering with their scroll tracking
    if (hasInternalScroll) {
        return (
            <div
                className={styles.sectionWrapperWithScroll}
                data-card-index={index}
            >
                {children}
            </div>
        );
    }

    // Calculate z-index: earlier cards (lower index) should be behind
    // So later cards stack on top
    const zIndex = index + 1;

    return (
        <div className={styles.sectionWrapper} style={{ zIndex }}>
            <div className={styles.pageFlipScene}>
                <div className={styles.page} data-card-index={index}>
                    <div className={styles.pageContent}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Props for PageFlipContainer component
 */
interface PageFlipContainerProps {
    children: ReactNode;
    /** Indices of children that have internal scroll animations (e.g., Technology, Roadmap) */
    internalScrollIndices?: number[];
}

/**
 * PageFlipContainer Component
 * @description Container that creates stacked card effect using CSS sticky positioning
 * 
 * Each section becomes a card that:
 * - Stays sticky at the top while the next section scrolls up
 * - Gets covered by the next section as it scrolls over
 * - Creates a deck of stacked cards effect
 * 
 * This uses pure CSS sticky positioning for maximum performance and reliability.
 */
export function PageFlipContainer({
    children,
    internalScrollIndices = []
}: PageFlipContainerProps): ReactNode {
    const childArray = Children.toArray(children);

    return (
        <div className={styles.stackContainer}>
            {childArray.map((child, index) => (
                <StackedCard
                    key={index}
                    index={index}
                    hasInternalScroll={internalScrollIndices.includes(index)}
                >
                    {isValidElement(child)
                        ? cloneElement(child as ReactElement<{ key?: Key }>, { key: index })
                        : child
                    }
                </StackedCard>
            ))}
        </div>
    );
}

