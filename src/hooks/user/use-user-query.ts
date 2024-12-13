import { createServerActionHandler } from '@/lib/safe-action';
import { getCurrentUser } from '@/actions/auth/controller';
import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '@/lib/query-key';

export default function useUserQuery() {
  return useQuery({
    queryFn: createServerActionHandler(getCurrentUser),
    queryKey: [QueryKey.USER],
    throwOnError: false,
  });
}
