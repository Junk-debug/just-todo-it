import { createServerActionHandler } from '@/lib/safe-action';
import { getCurrentUser } from '@/actions/auth/controller';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/lib/query-keys';

export default function useUserQuery() {
  return useQuery({
    queryFn: createServerActionHandler(getCurrentUser),
    queryKey: [QueryKeys.USER],
    throwOnError: false,
  });
}
