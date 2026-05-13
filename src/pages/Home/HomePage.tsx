import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/shared/ui';
import { Hero } from '@/widgets/hero';
// import { Technology } from '@/widgets/technology';
import { Mission } from '@/widgets/mission';
import { Product } from '@/widgets/product';
import { TestFacility } from '@/widgets/test-facility';
import { Partners } from '@/widgets/partners';
import { PageFlipContainer } from '@/widgets/page-flip';

/**
 * HomePage Component
 * @description Landing page with stacked card animation
 * 
 * Section Order:
 * 0 - Hero
 * 1 - Mission Criticality ("Propulsion is the Bottleneck")
 * 2 - Product (Harpy-1 Engine showcase)
 * 3 - Test Facility
 * 
 * Partners section is rendered outside the container (no animation)
 * so it combines with the Footer naturally.
 */
export function HomePage(): ReactNode {
    return (
        <>
            <PageFlipContainer >
                <ErrorBoundary FallbackComponent={ErrorFallback}> <Hero /> </ErrorBoundary>

                <ErrorBoundary FallbackComponent={ErrorFallback}> <Mission /> </ErrorBoundary>

                {/* <ErrorBoundary FallbackComponent={ErrorFallback}> <Technology /> </ErrorBoundary>  */}

            </PageFlipContainer>

            <ErrorBoundary FallbackComponent={ErrorFallback}> <Product /> </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback}> <TestFacility /> </ErrorBoundary>

            {/* </PageFlipContainer> */}

            {/* Partners section without animation - combines with Footer */}
            <ErrorBoundary FallbackComponent={ErrorFallback}> <Partners /> </ErrorBoundary>
        </>
    );
}
