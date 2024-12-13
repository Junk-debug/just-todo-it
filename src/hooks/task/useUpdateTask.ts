import { updateTask } from '@/actions/task/controller';
import { UpdateTaskDto } from '@/actions/task/types';
import { createServerActionHandler } from '@/lib/safe-action';
import { Task } from '@prisma/client';
import {
  useQueryClient,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskKeys } from './task-keys';

type TContext = {
  previousTasks: Task[] | undefined;
  previousTask: Task | undefined;
};

type UseUpdateTaskOptions = Omit<
  UseMutationOptions<Task, Error, UpdateTaskDto, TContext>,
  'mutationFn' | 'onMutate'
> & {
  onMutate?: (variables: UpdateTaskDto) => void;
};

export default function useUpdateTask({
  onMutate,
  onError,
  onSettled,
  ...options
}: UseUpdateTaskOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Task, Error, UpdateTaskDto, TContext>({
    mutationFn: createServerActionHandler(updateTask),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });

      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.list());
      const previousTask = queryClient.getQueryData<Task>(
        taskKeys.detail(newTask.id),
      );

      queryClient.setQueryData<Task>(taskKeys.detail(newTask.id), (oldTask) => {
        if (!oldTask) {
          return oldTask;
        }

        return { ...oldTask, ...newTask };
      });

      queryClient.setQueryData<Task[]>(taskKeys.list(), (oldTasks) => {
        if (!oldTasks) {
          return oldTasks;
        }

        return oldTasks.map((oldTask) =>
          oldTask.id === newTask.id ? { ...oldTask, ...newTask } : oldTask,
        );
      });

      if (onMutate) {
        onMutate(newTask);
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

      toast.error('Failed to update task');

      if (onError) {
        onError(error, variables, context);
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
