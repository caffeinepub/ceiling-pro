import { ReactNode, useEffect } from 'react';
import { useAdminAuthContext } from '../../context/AdminAuthContext';
import AdminLoginForm from './AdminLoginForm';
import { Card, CardContent } from '@/components/ui/card';

interface AdminAccessGateProps {
  children: ReactNode;
}

export default function AdminAccessGate({ children }: AdminAccessGateProps) {
  const { isLoggedIn, isLoading, validateSession } = useAdminAuthContext();

  // Revalidate session when component mounts
  useEffect(() => {
    validateSession();
  }, [validateSession]);

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Verifying access...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show login form if not logged in
  if (!isLoggedIn) {
    return <AdminLoginForm />;
  }

  // Render admin content if logged in
  return <>{children}</>;
}
