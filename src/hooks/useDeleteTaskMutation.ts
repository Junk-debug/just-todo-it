import { DeleteTaskDto } from '@/actions/task/types';
import { Task } from '@prisma/client';

import { deleteTask } from '@/actions/task/controller';
import {
  useQueryClient,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';

import { toast } from 'sonner';
import { createServerActionHandler } from '@/lib/safe-action';
import { QueryKeys } from '@/lib/query-keys';

type TContext = {
  previousTasks: Task[] | undefined;
  previousTask: Task | undefined;
};

type UseDeleteTaskMutationOptions = Omit<
  UseMutationOptions<Task, Error, DeleteTaskDto, TContext>,
  'mutationFn' | 'onMutate'
> & {
  onMutate?: (data: DeleteTaskDto) => void;
};

export default function useDeleteTaskMutation({
  onMutate,
  onError,
  onSuccess,
  onSettled,
  ...options
}: UseDeleteTaskMutationOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Task, Error, DeleteTaskDto, TContext>({
    mutationFn: createServerActionHandler(deleteTask),
    onMutate: async (data) => {
      const { id } = data;
      await queryClient.cancelQueries({ queryKey: [QueryKeys.TASKS] });
      await queryClient.cancelQueries({ queryKey: [QueryKeys.TASKS, id] });

      const previousTasks = queryClient.getQueryData<Task[]>([QueryKeys.TASKS]);
      const previousTask = queryClient.getQueryData<Task>([
        QueryKeys.TASKS,
        id,
      ]);

      queryClient.setQueryData<Task>([QueryKeys.TASKS, id], undefined);
      queryClient.setQueryData<Task[]>([QueryKeys.TASKS], (oldTasks) => {
        if (!oldTasks) {
          return oldTasks;
        }

        return oldTasks.filter((task) => task.id !== id);
      });

      if (onMutate) {
        onMutate(data);
      }

      return { previousTasks, previousTask };
    },
    onError: (error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData([QueryKeys.TASKS], context.previousTasks);
      }

      if (context?.previousTask) {
        queryClient.setQueryData(
          [QueryKeys.TASKS, context.previousTask.id],
          context.previousTask,
        );
      }

      toast.error('Failed to delete task');

      if (onError) {
        onError(error, variables, context);
      }
    },
    onSuccess: (deletedTask, variables, context) => {
      toast.success('Task deleted successfully');

      if (onSuccess) {
        onSuccess(deletedTask, variables, context);
      }
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TASKS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TASKS, variables.id],
      });

      if (onSettled) {
        onSettled(data, error, variables, context);
      }
    },
    ...options,
  });

  return mutation;
}
