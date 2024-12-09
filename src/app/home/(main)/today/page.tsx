'use client';

import { Skeleton } from '@/components/ui/skeleton';

import { AddTaskFlow } from '@/components/add-task-flow';
import { TaskCard } from '@/components/task-card';

import { filterTodayTasks, getFormattedDate } from '@/lib/utils';
import { DetailedTask } from '@/actions/task/types';
import useTasksQuery from '@/hooks/useTasksQuery';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function MainPage() {
  const formattedToday = getFormattedDate(new Date());

  const { data, isLoading } = useTasksQuery();

  const tasks = filterTodayTasks(data || []) as DetailedTask[];

  return (
    <>
      <header className="mb-4">
        <h1 className="text-xl font-semibold text-center">Today</h1>
      </header>
      <h2 className="font-medium text-muted-foreground mb-2">
        {formattedToday}
      </h2>

      {!isLoading && tasks.length === 0 && (
        <>
          <div className="text-center font-medium flex justify-center items-center h-full">
            Nothing on your plate today, enjoy your free time! 🎉
          </div>
        </>
      )}

      <div className="flex-grow overflow-y-auto space-y-2 p-px pb-4">
        {isLoading && (
          <>
            <Skeleton className="w-full h-[4.625rem]" />
            <Skeleton className="w-full h-[4.625rem]" />
            <Skeleton className="w-full h-[4.625rem]" />
          </>
        )}
        {tasks.map((task) => {
          return (
            <TaskCard
              shared={task.assignments?.length > 1}
              showDueDate={false}
              key={task.id}
              task={task}
            />
          );
        })}
        {!isLoading && (
          <AddTaskFlow
            trigger={
              <Button
                size={'icon'}
                className="fixed bottom-[calc(env(safe-area-inset-bottom)+5rem)] right-8 gap-1 size-12 rounded-lg"
              >
                <Plus className="!size-7" />
              </Button>
            }
            defaultDueDate={new Date()}
          />
        )}
      </div>
    </>
  );
}
