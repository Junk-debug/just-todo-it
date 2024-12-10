'use client';

import {
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import { DeleteTaskButton } from './delete-task-button';

import { TaskRole, User } from '@prisma/client';
import { useTaskDrawerData } from './task-drawer-provider';
import useUpdateTask from '@/hooks/task/useUpdateTask';
import { EditFormData, EditTaskForm } from './edit-task-form';
import { ShareTaskFlow } from './share-task-flow';
import { DetailedTask } from '@/actions/task/types';
import { InfoIcon, Share } from 'lucide-react';
import { Button } from './ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';

export const TaskDetails = ({
  task,
  userId,
}: {
  task: DetailedTask;
  userId: User['id'];
}) => {
  const { close } = useTaskDrawerData();
  const { mutate } = useUpdateTask({
    onMutate: () => close(),
  });

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const isShared = task.assignments ? task.assignments.length > 1 : false;
  const owner =
    task.assignments &&
    task.assignments.find((a) => a.role === TaskRole.OWNER)?.user;
  const role =
    task.assignments &&
    (task.assignments.find((a) => a.userId === userId)?.role as TaskRole);

  const sharedToInfo = role === TaskRole.OWNER && (
    <>
      {isShared && (
        <div className="px-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <InfoIcon className="text-blue-500 flex-shrink-0" />
            <span>This task has been shared to: </span>
          </div>
          <ul className="list-disc pl-8">
            {task.assignments
              .filter((a) => a.role !== TaskRole.OWNER)
              .map((a) => (
                <li key={a.id}>
                  {a.user.name} ({a.user.email}) (
                  {a.accepted === null
                    ? 'pending'
                    : a.accepted
                      ? 'accepted'
                      : 'declined'}
                  )
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  );

  const sharedByInfo = isShared && owner && role !== TaskRole.OWNER && (
    <div className="px-4 flex gap-2">
      <InfoIcon className="text-blue-500 flex-shrink-0" />
      <div>
        <span>
          This task has been shared by: {owner.name} ({owner.email})
        </span>
        <br />
        <span>
          {role === TaskRole.VIEWER && 'You can only view it'}
          {role === TaskRole.EDITOR && 'You can edit it'}
        </span>
      </div>
    </div>
  );

  const handleSubmit = (formData: EditFormData) => {
    mutate({
      id: task.id,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
    });
  };

  const title = 'Edit task';
  const description = 'Provide new task details';

  if (isDesktop) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {sharedToInfo}

        <EditTaskForm
          disabled={role === TaskRole.VIEWER}
          className="pb-0"
          initialState={{
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
          }}
          onSubmit={handleSubmit}
        />

        <DialogFooter>
          {role === TaskRole.OWNER && (
            <>
              <ShareTaskFlow
                taskId={task.id}
                trigger={
                  <Button variant={'ghost'}>
                    <Share /> Share
                  </Button>
                }
              />

              <DeleteTaskButton taskId={task.id} onDelete={close} />
            </>
          )}
          {sharedByInfo}
        </DialogFooter>
      </>
    );
  }

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
        <DrawerDescription>{description}</DrawerDescription>
      </DrawerHeader>

      {sharedToInfo}

      {role === TaskRole.OWNER && (
        <div className="flex justify-end px-4 mb-2">
          <ShareTaskFlow
            taskId={task.id}
            trigger={
              <Button variant={'ghost'}>
                <Share /> Share
              </Button>
            }
          />
        </div>
      )}

      <EditTaskForm
        disabled={role === TaskRole.VIEWER}
        className="pb-0 px-4"
        initialState={{
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
        }}
        onSubmit={handleSubmit}
      />

      <DrawerFooter>
        {role === TaskRole.OWNER && (
          <DeleteTaskButton taskId={task.id} onDelete={close} />
        )}
        {sharedByInfo}
      </DrawerFooter>
    </>
  );
};
