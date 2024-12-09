import { updateTask } from '@/actions/task/controller';
import { UpdateTaskDto } from '@/actions/task/types';
import { QueryKey } from '@/lib/query-key';
import { createServerActionHandler } from '@/lib/safe-action';
import { Task } from '@prisma/client';
import {
  useQueryClient,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';

type TContext = {
  previousTasks: Task[] | undefined;
  previousTask: Task | undefined;
};

type UseUpdateTaskMutationOptions = Omit<
  UseMutationOptions<Task, Error, UpdateTaskDto, TContext>,
  'mutationFn' | 'onMutate'
> & {
  onMutate?: (variables: UpdateTaskDto) => void;
};

export default function useUpdateTaskMutation({
  onMutate,
  onError,
  onSettled,
  ...options
}: UseUpdateTaskMutationOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Task, Error, UpdateTaskDto, TContext>({
    mutationFn: createServerActionHandler(updateTask),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.TASKS] });
      await queryClient.cancelQueries({
        queryKey: [QueryKey.TASKS, newTask.id],
      });

      const previousTasks = queryClient.getQueryData<Task[]>([QueryKey.TASKS]);
      const previousTask = queryClient.getQueryData<Task>([
        QueryKey.TASKS,
        newTask.id,
      ]);

      queryClient.setQueryData<Task>(
        [QueryKey.TASKS, newTask.id],
        (oldTask) => {
          if (!oldTask) {
            return oldTask;
          }

          return { ...oldTask, ...newTask };
        },
      );

      queryClient.setQueryData<Task[]>([QueryKey.TASKS], (oldTasks) => {
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
        queryClient.setQueryData([QueryKey.TASKS], context.previousTasks);
      }

      if (context?.previousTask) {
        queryClient.setQueryData(
          [QueryKey.TASKS, context.previousTask.id],
          context.previousTask,
        );
      }

      toast.error('Failed to update task');

      if (onError) {
        onError(error, variables, context);
      }
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TASKS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.TASKS, variables.id],
      });

      if (onSettled) {
        onSettled(data, error, variables, context);
      }
    },
    ...options,
  });

  return mutation;
}
