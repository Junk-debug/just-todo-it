import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { DateSelect } from './date-select';

import useAddTask from '@/hooks/task/useAddTask';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { TaskPriority } from '@prisma/client';

type FormData = {
  title: string;
  description: string;
  dueDate: Date | null;
  priority: TaskPriority | null;
};

type Props = React.HTMLAttributes<HTMLFormElement> & {
  onSettled?: () => void;
  onMutate?: () => void;
  defaultValues: FormData;
};

export const AddTaskForm = ({
  onSettled,
  onMutate,
  defaultValues,
  className,
  children,
  ...props
}: Props) => {
  // TODO: add hookform later maybe
  const [formData, setFormData] = useState<FormData>(defaultValues);

  const { mutate } = useAddTask({
    onMutate: onMutate,
    onSettled: () => {
      setFormData(defaultValues);

      if (onSettled) {
        onSettled();
      }
    },
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      ...formData,
      priority: formData.priority || null,
      description: formData.description || null,
    });
  };

  return (
    <form
      onSubmit={submit}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <Label className="flex flex-col gap-2">
          Title
          <Input
            required
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Some important task"
          />
        </Label>
        <Label className="flex flex-col gap-2">
          Description
          <Textarea
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Some important description"
          />
        </Label>
        <div className="flex flex-col gap-2 items-start">
          <span className="text-sm font-medium leading-none">Due date</span>
          <DateSelect
            selectedDate={formData.dueDate}
            onSelectDate={(value) =>
              setFormData({ ...formData, dueDate: value })
            }
          />
        </div>
        <Label className="flex flex-col gap-2">
          Task priority
          <Select
            value={formData.priority || ''}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                priority: value !== 'null' ? (value as TaskPriority) : null,
              })
            }
            name="priority"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TaskPriority).map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
              <SelectItem value="null">No priority</SelectItem>
            </SelectContent>
          </Select>
        </Label>
      </div>
      {children}
    </form>
  );
};
