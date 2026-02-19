import { type ReactNode, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';

// ============================================================================
// Lazy-loaded Page Components
// @description Route-level code splitting for improved initial bundle size
// ============================================================================

const HomePage = lazy(() => import('@/pages/Home/HomePage').then(m => ({ default: m.HomePage })));
const ProductPage = lazy(() => import('@/pages/Product/ProductPage').then(m => ({ default: m.ProductPage })));
const BlogsPage = lazy(() => import('@/pages/Blogs/BlogsPage').then(m => ({ default: m.BlogsPage })));
const BlogPostPage = lazy(() => import('@/pages/Blogs/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const CareerPage = lazy(() => import('@/pages/Career/CareerPage').then(m => ({ default: m.CareerPage })));
const ContactPage = lazy(() => import('@/pages/Contact/ContactPage').then(m => ({ default: m.ContactPage })));
const TeamPage = lazy(() => import('@/pages/Team/TeamPage').then((m) => ({ default: m.TeamPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// ============================================================================
// Loading Fallback Component
// ============================================================================

/**
 * PageLoader - Minimal loading state for lazy-loaded pages
 */
function PageLoader(): ReactNode {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                color: 'var(--color-text-secondary, #888)',
            }}
            role="status"
            aria-label="Loading page..."
        >
            <div
                style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid currentColor',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }}
            />
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

// ============================================================================
// App Component
// ============================================================================

/**
 * App Component
 * @description Root application component with routing and lazy loading
 */
function App(): ReactNode {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route
                    path="/"
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <HomePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/product"
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <ProductPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/blogs"
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <BlogsPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/blogs/:id"
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <BlogPostPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/career"
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <CareerPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/team"
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <TeamPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/contact"
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <ContactPage />
                        </Suspense>
                    }
                />
                <Route
                    path="*"
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <NotFoundPage />
                        </Suspense>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
