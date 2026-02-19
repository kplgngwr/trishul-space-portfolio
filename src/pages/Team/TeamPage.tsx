import type { ReactNode } from 'react';
import { TeamSection } from './TeamSection';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/shared/ui';

export function TeamPage(): ReactNode {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <TeamSection />
        </ErrorBoundary>
    );
}
