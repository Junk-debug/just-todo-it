import { getAcceptedDetailedTasks } from '@/actions/task/controller';
import { useQuery } from '@tanstack/react-query';
import { taskKeys } from './task-keys';

export default function useTasks() {
  return useQuery({
    queryFn: getAcceptedDetailedTasks,
    queryKey: taskKeys.list(),
  });
}
