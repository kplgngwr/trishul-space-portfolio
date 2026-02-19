import { type ReactNode, type CSSProperties } from 'react';
import { motion, type MotionValue, useTransform } from 'framer-motion';
import styles from './swipe-ripple.module.css';

interface FlashlightGlowProps {
    /** Current mouse X position */
    mouseX: MotionValue<number>;
    /** Current mouse Y position */
    mouseY: MotionValue<number>;
    /** Whether mouse is hovering over container */
    isHovering: boolean;
    /** Container width for color interpolation */
    containerWidth?: number;
}

/**
 * Interpolate between colors based on a ratio (0-1)
 * Left (0) = Orange, Middle (0.5) = Light warm white, Right (1) = Blue
 * Uses multiple color stops to avoid muddy dark middle
 */
// Optimized to work with useTransform if needed, but for complex color logic 
// inside useTransform we might need a custom transform function.
// Since we want to avoid JS thread blocking, we'll keep the logic simple or use useTransform's interpolation.

/**
 * FlashlightGlow Component
 * @description Renders a subtle flashlight glow effect that changes color based on position
 * Refactored to use MotionValues to bypass React render cycle for position updates.
 */
export function SwipeRipple({
    mouseX,
    mouseY,
    isHovering,
    containerWidth = 1200,
}: FlashlightGlowProps): ReactNode {

    // Create a motion value for the background color based on X position
    const glowColor = useTransform(mouseX, (x) => {
        const ratio = Math.max(0, Math.min(1, x / containerWidth));

        // Inline color interpolation logic for performance
        if (ratio < 0.5) {
            // Transition from Vibrant Orange to Light warm (0 to 0.5)
            const t = ratio * 2;
            const r = Math.round(255 + (255 - 255) * t);
            const g = Math.round(160 + (230 - 160) * t);
            const b = Math.round(80 + (210 - 80) * t);
            return `${r}, ${g}, ${b}`;
        } else {
            // Transition from Light warm to Blue (0.5 to 1)
            const t = (ratio - 0.5) * 2;
            const r = Math.round(255 + (96 - 255) * t);
            const g = Math.round(230 + (165 - 230) * t);
            const b = Math.round(210 + (250 - 210) * t);
            return `${r}, ${g}, ${b}`;
        }
    });

    return (
        <div className={styles.swipeContainer}>
            {/* Flashlight glow that follows mouse with position-based color */}
            <motion.div
                className={`${styles.glowOverlay} ${isHovering ? styles.active : ''}`}
                style={{
                    // Framer motion optimized variables
                    '--mouse-x': useTransform(mouseX, (x) => `${x}px`),
                    '--mouse-y': useTransform(mouseY, (y) => `${y}px`),
                    '--glow-color': glowColor,
                } as CSSProperties}
            // Type cast needed because CSS custom properties aren't fully typed in style prop
            />
        </div>
    );
}
