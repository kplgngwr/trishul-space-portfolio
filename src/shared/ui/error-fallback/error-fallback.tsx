import type { ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import styles from './error-fallback.module.css';

/**
 * Error Fallback Component
 * @description Displayed when ErrorBoundary catches an error
 */
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps): ReactNode {
    return (
        <div className={styles.container} role="alert">
            <div className={styles.content}>
                <h2 className={styles.title}>Something went wrong</h2>
                <p className={styles.message}>
                    {error instanceof Error ? error.message : 'An unexpected error occurred'}
                </p>
                <button
                    type="button"
                    className={styles.button}
                    onClick={resetErrorBoundary}
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
