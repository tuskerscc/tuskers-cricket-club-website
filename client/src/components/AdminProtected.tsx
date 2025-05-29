import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import AdminLogin from '@/pages/AdminLogin';

interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      // Check session storage first
      const sessionAuth = sessionStorage.getItem('adminLoggedIn');
      
      if (!sessionAuth) {
        setIsAuthenticated(false);
        return;
      }

      // Verify with server
      try {
        const response = await fetch('/api/admin/verify', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Session expired or invalid
          sessionStorage.removeItem('adminLoggedIn');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        sessionStorage.removeItem('adminLoggedIn');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    setLocation('/');
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a] mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Authenticated - show admin content with logout option
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header with Logout */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center py-3">
          <div className="flex items-center">
            <span className="text-lg font-semibold text-[#1e3a8a]">Admin Panel</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Logged in as Admin</span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {children}
    </div>
  );
}