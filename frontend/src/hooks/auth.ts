import { pb } from '@lib/db';
import { useQuery } from '@tanstack/react-query';

async function getAuth() {
  // Refresh the auth state to ensure we have the latest user data
  try {
    await pb.collection('users').authRefresh();
  } catch (error) {
    console.log('Failed to refresh auth state:', error);
    return null;
  }

  // Return the authenticated user record if valid, otherwise return null
  return pb.authStore.isValid ? pb.authStore.record : null;
}

export function useAuth() {
  const query = useQuery({ queryKey: ['auth'], queryFn: getAuth });

  const adminEmails = ['admin@example.com'];
  const isAdmin = adminEmails.includes(query.data?.email) ?? false;

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isAuthenticated: !!query.data,
    isAdmin: isAdmin,
    refetch: query.refetch,
  };
}
