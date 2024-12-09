import { getAcceptedDetailedTasks } from '@/actions/task/controller';
import { QueryKey } from '@/lib/query-key';
import { useQuery } from '@tanstack/react-query';

export default function useTasksQuery() {
  return useQuery({
    queryFn: getAcceptedDetailedTasks,
    queryKey: [QueryKey.TASKS],
  });
}
