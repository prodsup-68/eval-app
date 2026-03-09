import { pb } from '@lib/db';
import { useQuery } from '@tanstack/react-query';

async function getAuth() {
  return pb.authStore.isValid ? pb.authStore.record : null;
}

export function useAuth() {
  const query = useQuery({ queryKey: ['auth'], queryFn: getAuth });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isAuthenticated: !!query.data,
    refetch: query.refetch,
  };
}
