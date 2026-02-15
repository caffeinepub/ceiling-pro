import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import AccountPage from './pages/AccountPage';
import { createRouter, RouterProvider, createRoute, createRootRoute } from '@tanstack/react-router';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';
import { Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';

// Layout component that wraps all routes
function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <Toaster />
    </div>
  );
}

// Define routes
const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/riyaz',
  component: AdminPage,
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account',
  component: AccountPage,
});

// Create router
const routeTree = rootRoute.addChildren([indexRoute, adminRoute, accountRoute]);
const router = createRouter({ routeTree });

// Declare router type for TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
