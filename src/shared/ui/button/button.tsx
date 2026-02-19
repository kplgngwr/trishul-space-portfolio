import { memo, type ReactNode, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react';
import styles from './button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: ReactNode;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    className?: string;
}

type ButtonAsButton = ButtonBaseProps &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
        as?: 'button';
    };

type ButtonAsAnchor = ButtonBaseProps &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
        as: 'a';
        href: string;
    };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

/**
 * Polymorphic Button component
 * @description Can render as button or anchor based on 'as' prop
 * Memoized to prevent unnecessary re-renders
 */
export const Button = memo(function Button(props: ButtonProps): ReactNode {
    const {
        variant = 'primary',
        size = 'md',
        children,
        icon,
        iconPosition = 'right',
        className = '',
        as,
        ...rest
    } = props;

    const classes = [
        styles.btn,
        styles[`btn-${variant}`],
        styles[`btn-${size}`],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const content = (
        <>
            {icon && iconPosition === 'left' && <span className={styles.icon}>{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && <span className={styles.icon}>{icon}</span>}
        </>
    );

    if (as === 'a') {
        return (
            <a className={classes} {...(rest as Omit<ButtonAsAnchor, keyof ButtonBaseProps | 'as'>)}>
                {content}
            </a>
        );
    }

    return (
        <button className={classes} type="button" {...(rest as Omit<ButtonAsButton, keyof ButtonBaseProps | 'as'>)}>
            {content}
        </button>
    );
});
