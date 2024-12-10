import {
  UpdateAcceptedStatusDto,
  updateAssignmentAcceptedStatus,
} from '@/actions/assignment/controller';
import { DetailedAssignment } from '@/actions/assignment/service';
import { QueryKey } from '@/lib/query-key';
import { createServerActionHandler } from '@/lib/safe-action';
import {
  useQueryClient,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskKeys } from './task/task-keys';

type TContext = {
  previousAssignments: DetailedAssignment[] | undefined;
};

type UseUpdateAssignmentAcceptedStatusOptions = Omit<
  UseMutationOptions<
    DetailedAssignment,
    Error,
    UpdateAcceptedStatusDto,
    TContext
  >,
  'mutationFn' | 'onMutate'
> & {
  onMutate?: (variables: UpdateAcceptedStatusDto) => void;
};

export default function useUpdateAssignmentAcceptedStatus({
  onMutate,
  onError,
  onSettled,
  ...options
}: UseUpdateAssignmentAcceptedStatusOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    DetailedAssignment,
    Error,
    UpdateAcceptedStatusDto,
    TContext
  >({
    mutationFn: createServerActionHandler(updateAssignmentAcceptedStatus),
    onMutate: async (newAssignmentData) => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.ASSIGNMENTS] });

      const previousAssignments = queryClient.getQueryData<
        DetailedAssignment[]
      >([QueryKey.ASSIGNMENTS]);

      queryClient.setQueryData<DetailedAssignment[]>(
        [QueryKey.ASSIGNMENTS],
        (oldAssignments) => {
          if (!oldAssignments) {
            return oldAssignments;
          }

          return oldAssignments.map((oldAssignment) =>
            oldAssignment.id === newAssignmentData.id
              ? { ...oldAssignment, ...newAssignmentData }
              : oldAssignment,
          );
        },
      );

      if (onMutate) {
        onMutate(newAssignmentData);
      }

      return { previousAssignments };
    },

    onError: (err, newAssignmentData, context) => {
      if (context?.previousAssignments) {
        queryClient.setQueryData(
          [QueryKey.ASSIGNMENTS],
          context.previousAssignments,
        );
      }

      toast.error('Failed to update task');

      if (onError) {
        onError(err, newAssignmentData, context);
      }
    },

    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.ASSIGNMENTS] });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });

      if (onSettled) {
        onSettled(data, error, variables, context);
      }
    },
    ...options,
  });

  return mutation;
}
