import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/lib/auth';

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('useAuth: checkAuth started, isLoading:', isLoading);
      setLoading(true);
      
      try {
        if (authService.isAuthenticated()) {
          console.log('useAuth: isAuthenticated is true');
          const currentUser = await authService.getCurrentUser();
          
          if (currentUser) {
            console.log('useAuth: currentUser found', currentUser);
            setUser(currentUser);
          } else {
            console.log('useAuth: currentUser not found, redirecting to /login');
            setUser(null);
            if (requireAuth) {
              router.push('/login');
            }
          }
        } else {
          console.log('useAuth: isAuthenticated is false, redirecting to /login');
          setUser(null);
          if (requireAuth) {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('useAuth: Auth check error:', error);
        setUser(null);
        if (requireAuth) {
          router.push('/login');
        }
      } finally {
        console.log('useAuth: checkAuth finished, setting isLoading to false');
        setLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, router, setUser, setLoading, isLoading]);

  const login = async (username: string, password: string) => {
    const { user } = await authService.login(username, password);
    setUser(user);
    router.push('/dashboard');
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
