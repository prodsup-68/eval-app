import { Navigate, Outlet } from 'react-router';
import { useAuth } from 'src/hooks/auth';

function AuthGuard() {
  const auth = useAuth();
  console.log('AuthGuard auth:', auth);
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }
  return auth.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
export default AuthGuard;
