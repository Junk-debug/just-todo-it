import { NormalizedUser, updateUser } from '@/actions/user/controller';
import { UpdateUserDto } from '@/actions/user/types';
import { QueryKey } from '@/lib/query-key';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

type Options = Omit<
  UseMutationOptions<
    NormalizedUser,
    Error,
    Pick<UpdateUserDto, 'name' | 'password' | 'image'>
  >,
  'mutationFn'
>;

export default function useUpdateUser({ onSettled, ...options }: Options = {}) {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, ...mutation } = useMutation<
    NormalizedUser,
    Error,
    Pick<UpdateUserDto, 'name' | 'password' | 'image'>
  >({
    mutationFn: updateUser,
    onSettled: (data, error, vars, ctx) => {
      queryClient.refetchQueries({ queryKey: [QueryKey.USER] });
      onSettled?.(data, error, vars, ctx);
    },
    ...options,
  });

  return {
    ...mutation,
    updateUser: mutate,
    updateUserAsync: mutateAsync,
  };
}