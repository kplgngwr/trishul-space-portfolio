import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/shared/ui';
import { About } from '@/widgets/about';
import { VisionMission } from '@/widgets/vision-mission';
import { TeamSection } from './TeamSection';

export function TeamPage(): ReactNode {
    return (
        <>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <About />
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <VisionMission />
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <TeamSection />
            </ErrorBoundary>
        </>
    );
}
