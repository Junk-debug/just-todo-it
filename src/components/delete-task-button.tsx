import { Button, ButtonProps } from './ui/button';
import ConfirmFlow from './confirm-flow';

import { useState } from 'react';
import { Task } from '@prisma/client';
import useDeleteTask from '@/hooks/task/useDeleteTask';

export const DeleteTaskButton = ({
  taskId,
  onDelete,
  ...props
}: Omit<ButtonProps, 'children' | 'asChild'> & {
  taskId: Task['id'];
  onDelete?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const { mutate } = useDeleteTask({
    onMutate: () => {
      setOpen(false);
    },
    onSettled: () => {
      if (onDelete) {
        onDelete();
      }
    },
  });

  return (
    <ConfirmFlow
      open={open}
      onOpenChange={setOpen}
      trigger={<Button {...props}>Delete</Button>}
      title="Are you sure?"
      description="This action cannot be undone. This will permanently delete your task."
      confirmText="Yes, delete it"
      onConfirm={() => mutate({ id: taskId })}
    />
  );
};
