import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/shared/ui';
import { Hero } from '@/widgets/hero';
import { Technology } from '@/widgets/technology';
import { Roadmap } from '@/widgets/roadmap';
import { TestFacility } from '@/widgets/test-facility';
import { About } from '@/widgets/about';
import { Partners } from '@/widgets/partners';
import { PageFlipContainer } from '@/widgets/page-flip';

/**
 * HomePage Component
 * @description Landing page with stacked card animation
 * 
 * Section Order:
 * 0 - Hero
 * 1 - Technology (has internal scroll animation)
 * 2 - Our Journey / Roadmap (has internal scroll animation)
 * 3 - Our Team
 * 
 * Partners section is rendered outside the container (no animation)
 * so it combines with the Footer naturally.
 */
export function HomePage(): ReactNode {
    return (
        <>
            <PageFlipContainer internalScrollIndices={[1, 2]}>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Hero />
                </ErrorBoundary>

                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Technology />
                </ErrorBoundary>

                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <About />
                </ErrorBoundary>

                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Roadmap />
                </ErrorBoundary>

                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <TestFacility />
                </ErrorBoundary>
            </PageFlipContainer>

            {/* Partners section without animation - combines with Footer */}
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Partners />
            </ErrorBoundary>
        </>
    );
}
