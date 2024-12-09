import { updateTask } from '@/actions/task/controller';
import { UpdateTaskDto } from '@/actions/task/types';
import { QueryKeys } from '@/lib/query-keys';
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
      await queryClient.cancelQueries({ queryKey: [QueryKeys.TASKS] });
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.TASKS, newTask.id],
      });

      const previousTasks = queryClient.getQueryData<Task[]>([QueryKeys.TASKS]);
      const previousTask = queryClient.getQueryData<Task>([
        QueryKeys.TASKS,
        newTask.id,
      ]);

      queryClient.setQueryData<Task>(
        [QueryKeys.TASKS, newTask.id],
        (oldTask) => {
          if (!oldTask) {
            return oldTask;
          }

          return { ...oldTask, ...newTask };
        },
      );

      queryClient.setQueryData<Task[]>([QueryKeys.TASKS], (oldTasks) => {
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
        queryClient.setQueryData([QueryKeys.TASKS], context.previousTasks);
      }

      if (context?.previousTask) {
        queryClient.setQueryData(
          [QueryKeys.TASKS, context.previousTask.id],
          context.previousTask,
        );
      }

      toast.error('Failed to update task');

      if (onError) {
        onError(error, variables, context);
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
