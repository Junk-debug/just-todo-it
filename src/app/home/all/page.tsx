'use client';

import { DetailedTask } from '@/actions/task/types';
import { AddTaskFlow } from '@/components/add-task-flow';
import { TaskCard } from '@/components/task-card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import useTasksQuery from '@/hooks/useTasksQuery';
import {
  SortOptions,
  filterUncompletedTasks,
  getSortedTasks,
} from '@/lib/utils';

import { ArrowDownUp, FilterIcon, Plus } from 'lucide-react';
import { useState } from 'react';

const SortSelect = ({
  value,
  onValueChange,
}: {
  value: SortOptions;
  onValueChange: (value: SortOptions) => void;
}) => {
  return (
    <Select
      value={value}
      onValueChange={(val) => onValueChange(val as SortOptions)}
    >
      <SelectTrigger
        showArrow={false}
        className="justify-center w-full sm:w-auto"
      >
        <ArrowDownUp className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort By</SelectLabel>
          {Object.values(SortOptions).map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default function AllPage() {
  const [sort, setSort] = useState<SortOptions>(SortOptions.CREATED_ASC);
  const [showCompleted, setShowCompleted] = useState(false);

  const { data, isLoading } = useTasksQuery();

  const tasks = (
    showCompleted
      ? getSortedTasks(data || [], sort)
      : filterUncompletedTasks(getSortedTasks(data || [], sort))
  ) as DetailedTask[];

  return (
    <>
      <header className="mb-4">
        <h1 className="text-xl font-semibold text-center">All tasks</h1>
      </header>

      <div className="mb-4 flex-wrap flex gap-2">
        <SortSelect value={sort} onValueChange={setSort} />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <FilterIcon />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <h3 className="font-semibold mb-2">Filters</h3>
            <Label className="flex items-center gap-1">
              <Checkbox
                checked={showCompleted}
                onCheckedChange={(value: boolean) => setShowCompleted(value)}
              />
              Show completed tasks
            </Label>
          </PopoverContent>
        </Popover>
      </div>

      {!isLoading && tasks.length === 0 && (
        <div className="text-center font-medium flex items-center justify-center h-full">
          You don&apos;t have any tasks yet. Try adding a new task.
        </div>
      )}

      <div className="flex-grow overflow-y-auto space-y-2 p-px pb-4">
        {isLoading && (
          <>
            <Skeleton className="w-full h-[4.625rem]" />
            <Skeleton className="w-full h-[4.625rem]" />
            <Skeleton className="w-full h-[4.625rem]" />
          </>
        )}

        {tasks.map((task) => (
          <TaskCard
            shared={task.assignments?.length > 1}
            key={task.id}
            task={task}
          />
        ))}

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
