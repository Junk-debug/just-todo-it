'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useQuery } from '@tanstack/react-query';
import { getDetailedTaskById } from '@/actions/task/controller';
import { DetailedTask } from '@/actions/task/types';
import useUserQuery from '@/hooks/user/use-user-query';
import { useMediaQuery } from '@/hooks/useMediaQuery';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerProps,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { DialogProps } from '@radix-ui/react-dialog';
import { EditTaskForm } from './edit-task-form';
import { TaskDetails } from './task-details';
import { taskKeys } from '@/hooks/task/task-keys';

const TaskDrawerContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
  task: DetailedTask | null;
}>({
  open: false,
  setOpen: () => {},
  close: () => {},
  task: null,
});

const TempLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DrawerHeader>
      <DrawerTitle>{children}</DrawerTitle>
      <DrawerDescription hidden>No description</DrawerDescription>
    </DrawerHeader>
  );
};

const FlowLayout = ({
  children,
  open,
  onOpenChange,
  onClose,
}: {
  children: React.ReactNode;
  open: DialogProps['open'];
  onOpenChange: DialogProps['onOpenChange'];
  onClose: DrawerProps['onClose'];
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (onOpenChange) {
            if (!open && onClose) {
              onClose();
            }
            onOpenChange(open);
          }
        }}
      >
        <DialogContent>{children}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} onClose={onClose}>
      <DrawerContent>{children}</DrawerContent>
    </Drawer>
  );
};

const TaskFlowSkeleton = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const title = 'Edit task';
  const description = 'Provide new task details';

  if (isDesktop) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <EditTaskForm
          onSubmit={() => {}}
          initialState={{
            description: '',
            title: '',
            dueDate: null,
            priority: null,
          }}
          disabled={true}
        />
      </>
    );
  }

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
        <DrawerDescription>{description}</DrawerDescription>
      </DrawerHeader>
      <EditTaskForm
        className="px-4 pb-4 animate-pulse"
        onSubmit={() => {}}
        initialState={{
          description: '',
          title: '',
          dueDate: null,
          priority: null,
        }}
        disabled={true}
      />
    </>
  );
};

function TaskDrawerProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: user, isLoading: isUserLoading } = useUserQuery();

  const taskId = searchParams.get('taskId');

  const [open, setOpen] = useState(!!taskId);

  const {
    data: task,
    isLoading: isTaskLoading,
    error,
  } = useQuery({
    enabled: !!taskId,
    queryFn: () => {
      if (taskId) {
        return getDetailedTaskById(taskId);
      }
      return undefined;
    },
    queryKey: taskKeys.detail(taskId || ''),
  });

  const loading = isTaskLoading || isUserLoading;

  useEffect(() => {
    setOpen(!!taskId);
  }, [taskId]);

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('taskId');

    router.replace(pathname + '?' + params.toString());
  }, [pathname, router, searchParams]);

  return (
    <TaskDrawerContext.Provider
      value={{ open, setOpen, close, task: task || null }}
    >
      <FlowLayout open={open} onOpenChange={setOpen} onClose={close}>
        {loading && <TaskFlowSkeleton />}
        {error && <TempLayout>{error.message}</TempLayout>}
        {task && user && <TaskDetails task={task} userId={user.id} />}
      </FlowLayout>
      {children}
    </TaskDrawerContext.Provider>
  );
}

export function useTaskDrawerData() {
  const context = useContext(TaskDrawerContext);
  if (!context) {
    throw new Error(
      'useTaskDrawerData must be used within a TaskDrawerProvider',
    );
  }
  return context;
}

export default memo(TaskDrawerProvider);
