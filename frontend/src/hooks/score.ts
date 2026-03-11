import { pb } from '@lib/db';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from './auth';

export function useScore() {
  const auth = useAuth();

  async function getScore() {
    return pb
      .collection('scores')
      .getFullList({ filter: `user = "${auth?.data?.id}"` });
  }
  const query = useQuery({
    queryKey: ['score'],
    queryFn: getScore,
    enabled: !!auth.data,
  });

  return {
    data: query.data ? query.data[0] : null,
    isLoading: query.isLoading,
    error: query.error,
  };
}
