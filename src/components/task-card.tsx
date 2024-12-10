'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { DateIcon } from './ui/date-icon';

import { Task } from '@prisma/client';
import { cn, formatDate, getPriorityColor } from '@/lib/utils';
import { useRouter } from 'next/navigation';

import useUpdateTask from '@/hooks/task/useUpdateTask';
import { UsersIcon } from 'lucide-react';

export type TaskCardProps = React.HTMLAttributes<HTMLDivElement> & {
  task: Task;
  showDueDate?: boolean;
  shared?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

export const TaskCard = ({
  task: { id, title, description, completed, dueDate, priority },
  showDueDate = true,
  shared,
  ref,
  className,
  ...props
}: TaskCardProps) => {
  const router = useRouter();

  const { mutate } = useUpdateTask();

  const onCheckedChange = async (value: boolean) => {
    mutate({ id, completed: value });
  };

  const onClick = () => {
    router.replace(`?taskId=${id}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        'cursor-pointer active:scale-[.97] transition-transform duration-200 has-[.checkbox:active]:scale-100',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        'relative overflow-hidden',
        className,
      )}
      ref={ref}
      {...props}
    >
      {priority && (
        <div
          style={{ backgroundColor: getPriorityColor(priority) }}
          className={cn('left-0 w-1 absolute h-full')}
        />
      )}
      <CardHeader className="p-4 space-y-0 ">
        <div className="flex flex-row gap-2 items-center">
          <Checkbox
            className="checkbox size-5 rounded-full"
            onCheckedChange={onCheckedChange}
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            checked={completed}
          />
          <CardTitle
            className={cn(
              '!m-0',
              'peer-data-[state=checked]:line-through peer-data-[state=checked]:text-muted-foreground',
              'overflow-hidden text-ellipsis',
            )}
          >
            {title}
          </CardTitle>
          {shared && (
            <UsersIcon className="text-muted-foreground size-5 flex-shrink-0 ml-auto" />
          )}
        </div>

        {description && (
          <span className="pl-7 !mt-0 text-muted-foreground text-sm truncate">
            {description}
          </span>
        )}

        {showDueDate && (
          <span className="pl-7 flex gap-1 items-center text-primary text-sm text-nowrap overflow-hidden text-ellipsis">
            <DateIcon date={dueDate || undefined} className="size-3.5" />
            {dueDate ? formatDate(dueDate) : 'No due date'}
          </span>
        )}
      </CardHeader>
    </Card>
  );
};
