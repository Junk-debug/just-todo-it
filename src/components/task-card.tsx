'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { DateIcon } from './ui/date-icon';

import { Task } from '@prisma/client';
import { cn, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

import useUpdateTaskMutation from '@/hooks/useUpdateTaskMutation';

export type TaskCardProps = React.HTMLAttributes<HTMLDivElement> & {
  task: Task;
  showDueDate?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

export const TaskCard = ({
  task: { id, title, description, completed, dueDate },
  showDueDate = true,
  ref,
  className,
  ...props
}: TaskCardProps) => {
  const router = useRouter();

  const { mutate } = useUpdateTaskMutation();

  const onCheckedChange = async (value: boolean) => {
    mutate({ id, completed: value });
  };

  const onClick = () => {
    router.push(`?taskId=${id}`);

    const voices = speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance('Пошел нахуй пидорас');
    utterance.voice = voices.find((voice) => voice.lang === 'ru-RU') || null;
    speechSynthesis.speak(utterance);
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
        className,
      )}
      ref={ref}
      {...props}
    >
      <CardHeader className="p-4 space-y-0">
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
        </div>

        {description && (
          <span className="pl-7 !mt-0 text-muted-foreground text-sm text-nowrap overflow-hidden text-ellipsis">
            {description}
          </span>
        )}

        {dueDate && showDueDate && (
          <span className="pl-7 flex gap-1 items-center text-primary text-sm text-nowrap overflow-hidden text-ellipsis">
            <DateIcon date={dueDate} className="size-3.5" />
            {dueDate ? formatDate(dueDate) : 'No due date'}
          </span>
        )}
      </CardHeader>
    </Card>
  );
};
