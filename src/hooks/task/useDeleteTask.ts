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
import { taskKeys } from './task-keys';

type TContext = {
  previousTasks: Task[] | undefined;
  previousTask: Task | undefined;
};

type UseDeleteTaskOptions = Omit<
  UseMutationOptions<Task, Error, DeleteTaskDto, TContext>,
  'mutationFn' | 'onMutate'
> & {
  onMutate?: (data: DeleteTaskDto) => void;
};

export default function useDeleteTask({
  onMutate,
  onError,
  onSuccess,
  onSettled,
  ...options
}: UseDeleteTaskOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Task, Error, DeleteTaskDto, TContext>({
    mutationFn: createServerActionHandler(deleteTask),
    onMutate: async (data) => {
      const { id } = data;
      await queryClient.cancelQueries({ queryKey: taskKeys.all });

      const previousTask = queryClient.getQueryData<Task>(taskKeys.detail(id));
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.list());

      queryClient.setQueryData<Task>(taskKeys.detail(id), undefined);
      queryClient.setQueryData<Task[]>(taskKeys.list(), (oldTasks) => {
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
        queryClient.setQueryData(taskKeys.list(), context.previousTasks);
      }

      if (context?.previousTask) {
        queryClient.setQueryData(
          taskKeys.detail(context.previousTask.id),
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
      queryClient.invalidateQueries({ queryKey: taskKeys.all });

      if (onSettled) {
        onSettled(data, error, variables, context);
      }
    },
    ...options,
  });

  return mutation;
}
