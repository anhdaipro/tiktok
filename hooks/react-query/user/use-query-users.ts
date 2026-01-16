import UserApi from '@/services/api/user';
import { useQuery } from '@tanstack/react-query';

export const useUserSearch = (keyword: string | null, enabled = true) => {
  return useQuery({
    queryKey: ['users', 'search', keyword],
    queryFn: () => UserApi.searchUsers(keyword!),
    enabled: !!keyword && enabled, // Only run if keyword exists
    staleTime: 1000 * 60, // Cache results for 1 minute
  });
};
