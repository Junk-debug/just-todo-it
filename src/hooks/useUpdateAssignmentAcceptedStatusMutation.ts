import {
  UpdateAcceptedStatusDto,
  updateAssignmentAcceptedStatus,
} from '@/actions/assignment/controller';
import { DetailedAssignment } from '@/actions/assignment/service';
import {
  useQueryClient,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';

type TContext = {
  previousAssignments: DetailedAssignment[] | undefined;
};

type UseUpdateTaskMutationOptions = Omit<
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

export default function useUpdateAssignmentAcceptedStatusMutation({
  onMutate,
  onError,
  onSettled,
  ...options
}: UseUpdateTaskMutationOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    DetailedAssignment,
    Error,
    UpdateAcceptedStatusDto,
    TContext
  >({
    mutationFn: updateAssignmentAcceptedStatus,
    onMutate: async (newAssignmentData) => {
      await queryClient.cancelQueries({ queryKey: ['assignments'] });

      const previousAssignments = queryClient.getQueryData<
        DetailedAssignment[]
      >(['assignments']);

      queryClient.setQueryData<DetailedAssignment[]>(
        ['assignments'],
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
        queryClient.setQueryData(['assignments'], context.previousAssignments);
      }

      toast.error('Failed to update task');

      if (onError) {
        onError(err, newAssignmentData, context);
      }
    },

    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });

      if (onSettled) {
        onSettled(data, error, variables, context);
      }
    },
    ...options,
  });

  return mutation;
}
