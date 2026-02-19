import { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/shared/ui';
import { useScrollController, useHashScroll } from '@/shared/lib';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

/**
 * Layout Component
 * @description Shared layout wrapper with Header and Footer for all pages
 */
export function Layout(): ReactNode {
    useScrollController();
    useHashScroll({ smooth: true, delay: 900, offset: 80 });

    return (
        <>
            <a href="#main-content" className="skip-to-content">
                Skip to main content
            </a>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Header />
            </ErrorBoundary>

            <main id="main-content">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Outlet />
                </ErrorBoundary>
            </main>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Footer />
            </ErrorBoundary>
        </>
    );
}
