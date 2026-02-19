import {
    type ReactNode,
    type HTMLAttributes,
    useState,
    useRef,
    useCallback,
} from 'react';
import styles from './glow-card.module.css';

interface GlowCardProps extends HTMLAttributes<HTMLElement> {
    /** Card content */
    children: ReactNode;
    /** Optional additional className */
    className?: string;
    /** Glow color (CSS color value) - defaults to blue */
    glowColor?: string;
    /** Glow intensity (0-1) - defaults to 0.15 */
    glowIntensity?: number;
    /** Glow radius in pixels - defaults to 150 */
    glowRadius?: number;
    /** Whether the glow effect is disabled */
    disabled?: boolean;
    /** HTML tag to render as */
    as?: 'div' | 'article' | 'section' | 'a';
    /** Optional href for anchor elements */
    href?: string;
}

/**
 * GlowCard Component
 * @description A card wrapper that adds a blue flashlight glow effect on hover
 */
export function GlowCard({
    children,
    className = '',
    glowColor = 'rgba(59, 130, 246, 0.15)',
    glowIntensity = 0.15,
    glowRadius = 150,
    disabled = false,
    as: Component = 'div',
    ...props
}: GlowCardProps): ReactNode {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const cardRef = useRef<HTMLElement>(null);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            if (disabled || !cardRef.current) return;

            const rect = cardRef.current.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        },
        [disabled]
    );

    const handleMouseEnter = useCallback(() => {
        if (!disabled) setIsHovering(true);
    }, [disabled]);

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
    }, []);

    // Parse color to extract RGB values if needed
    const gradientColor = glowColor.includes('rgba')
        ? glowColor
        : `rgba(59, 130, 246, ${glowIntensity})`;

    return (
        <Component
            ref={cardRef as React.RefObject<never>}
            className={`${styles.glowCard} ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {/* Glow overlay */}
            <div
                className={`${styles.glowOverlay} ${isHovering ? styles.active : ''}`}
                style={{
                    background: `radial-gradient(${glowRadius}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${gradientColor}, transparent 80%)`,
                }}
            />
            {/* Card content */}
            <div className={styles.content}>{children}</div>
        </Component>
    );
}

