import { getAcceptedDetailedTasks } from '@/actions/task/controller';
import { QueryKeys } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';

export default function useTasksQuery() {
  return useQuery({
    queryFn: getAcceptedDetailedTasks,
    queryKey: [QueryKeys.TASKS],
  });
}
