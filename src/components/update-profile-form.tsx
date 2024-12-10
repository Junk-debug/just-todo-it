'use client';

import { ComponentProps } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User } from '@prisma/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import ResetPasswordDrawer from './reset-password-drawer';
import useUpdateUser from '@/hooks/user/use-update-user';

type Props = ComponentProps<'form'> & {
  user: Pick<User, 'name' | 'email' | 'image'>;
};

const UpdateProfileForm: React.FC<Props> = ({ user, ...rest }) => {
  const { updateUser, isPending } = useUpdateUser({
    onError: (error) =>
      toast.error('Failed to update user info', {
        description: error.message,
      }),
    onSuccess: () => toast.success('Profile updated successfully'),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('name') as string;

    updateUser({ name });
    rest.onSubmit?.(e);
  };

  return (
    <form
      {...rest}
      className={cn('space-y-4 flex flex-col', rest.className)}
      onSubmit={handleSubmit}
    >
      <Label className="flex flex-col gap-2">
        Name
        <Input name="name" defaultValue={user.name ?? ''} />
      </Label>

      <Label
        title="You can't change your email"
        className="flex flex-col gap-2"
      >
        Email
        <Input name="email" value={user.email} disabled />
      </Label>

      <div className="flex flex-wrap gap-4">
        <ResetPasswordDrawer
          userEmail={user.email}
          trigger={
            <Button
              type="button"
              className="w-full sm:w-auto"
              variant="outline"
            >
              Reset password
            </Button>
          }
        />

        <Button
          className="items-end w-full sm:w-auto"
          type="submit"
          isLoading={isPending}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default UpdateProfileForm;
