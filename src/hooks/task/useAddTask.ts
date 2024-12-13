import { addTask } from '@/actions/task/controller';
import { AddTaskDto } from '@/actions/task/types';
import { createServerActionHandler } from '@/lib/safe-action';
import { Task } from '@prisma/client';
import {
  useQueryClient,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { taskKeys } from './task-keys';

type Dto = Required<AddTaskDto>;

type TContext = {
  previousTasks: Task[] | undefined;
};

type UseAddTaskOptions = Omit<
  UseMutationOptions<Task, Error, Dto, TContext>,
  'mutationFn' | 'onMutate'
> & {
  onMutate?: (variables: Dto) => void;
};

export default function useAddTask({
  onMutate,
  onError,
  onSuccess,
  onSettled,
  ...options
}: UseAddTaskOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Task, Error, Dto, TContext>({
    mutationFn: createServerActionHandler(addTask),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });

      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.list());
      queryClient.setQueryData<Task>(taskKeys.detail(newTask.id), newTask);

      queryClient.setQueryData<Task[]>(taskKeys.list(), (oldTasks) => {
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
        queryClient.setQueryData(taskKeys.list(), context.previousTasks);
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
      queryClient.invalidateQueries({ queryKey: taskKeys.all });

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

    return mutation.mutate({
      id: uuidv4(),
      completed: false,
      createdAt,
      updatedAt: createdAt,
      ...data,
    });
  };

  const mutateAsync = (
    data: Pick<AddTaskDto, 'title' | 'description' | 'dueDate' | 'priority'>,
  ) => {
    const createdAt = new Date();

    return mutation.mutateAsync({
      id: uuidv4(),
      completed: false,
      createdAt,
      updatedAt: createdAt,
      ...data,
    });
  };

  return { ...mutation, mutate, mutateAsync };
}
