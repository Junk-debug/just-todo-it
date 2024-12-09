import { addTask } from '@/actions/task/controller';
import { AddTaskDto } from '@/actions/task/types';
import { QueryKey } from '@/lib/query-key';
import { createServerActionHandler } from '@/lib/safe-action';
import { Task } from '@prisma/client';
import {
  useQueryClient,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

type Dto = Required<AddTaskDto>;

type TContext = {
  previousTasks: Task[] | undefined;
};

type UseAddTaskMutationOptions = Omit<
  UseMutationOptions<Task, Error, Dto, TContext>,
  'mutationFn' | 'onMutate'
> & {
  onMutate?: (variables: Dto) => void;
};

export default function useAddTaskMutation({
  onMutate,
  onError,
  onSuccess,
  onSettled,
  ...options
}: UseAddTaskMutationOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Task, Error, Dto, TContext>({
    mutationFn: createServerActionHandler(addTask),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.TASKS] });

      const previousTasks = queryClient.getQueryData<Task[]>([QueryKey.TASKS]);
      queryClient.setQueryData<Task>([QueryKey.TASKS, newTask.id], newTask);

      queryClient.setQueryData<Task[]>([QueryKey.TASKS], (oldTasks) => {
        if (!oldTasks) {
          return oldTasks;
        }

        return [...oldTasks, newTask];
      });

      if (onMutate) {
        onMutate(newTask);
      }

      return { previousTasks };
    },
    onError: (error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData([QueryKey.TASKS], context.previousTasks);
      }

      toast.error(error.message);

      if (onError) {
        onError(error, variables, context);
      }
    },
    onSuccess: (newTask, variables, context) => {
      toast.success('Task added successfully');

      if (onSuccess) {
        onSuccess(newTask, variables, context);
      }
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TASKS] });

      if (onSettled) {
        onSettled(data, error, variables, context);
      }
    },
    ...options,
  });

  const mutate = (
    data: Pick<AddTaskDto, 'title' | 'description' | 'dueDate' | 'priority'>,
  ) => {
    const createdAt = new Date();

    mutation.mutate({
      id: uuidv4(),
      completed: false,
      createdAt,
      updatedAt: createdAt,
      ...data,
    });
  };

  return { ...mutation, mutate };
}
