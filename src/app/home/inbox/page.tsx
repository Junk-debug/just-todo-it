'use client';

import { AssignmentCard } from '@/components/assignment-card';
import { toast } from 'sonner';

import { getDetailedNonOwnerAssignments } from '@/actions/assignment/controller';
import { useQuery } from '@tanstack/react-query';
import useUpdateAssignmentAcceptedStatusMutation from '@/hooks/useUpdateAssignmentAcceptedStatusMutation';
import { DetailedAssignment } from '@/actions/assignment/service';
import { Skeleton } from '@/components/ui/skeleton';
import { QueryKeys } from '@/lib/query-keys';

const AssignmentsList = ({
  assignments,
  onAccept,
  onDecline,
}: {
  assignments: DetailedAssignment[];
  onAccept: (assignmentId: string) => void;
  onDecline: (assignmentId: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      {assignments.map((assignment) => {
        return (
          <AssignmentCard
            onAccept={onAccept}
            onDecline={onDecline}
            key={assignment.id}
            info={{
              assignmentId: assignment.id,
              timeSent: assignment.createdAt,
              taskInfo: {
                title: assignment.task.title,
                description: assignment.task.description,
              },
              owner: assignment.task.assignments[0].user,
              accepted: assignment.accepted,
            }}
          />
        );
      })}
    </div>
  );
};

export default function InboxPage() {
  const { data, isLoading, error } = useQuery({
    queryFn: getDetailedNonOwnerAssignments,
    queryKey: [QueryKeys.ASSIGNMENTS],
  });

  const { mutate } = useUpdateAssignmentAcceptedStatusMutation({
    onSuccess({ accepted }) {
      toast.success(accepted ? 'Assignment accepted' : 'Assignment declined');
    },
  });

  const assignments = data || [];

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const newAssignments = assignments
    .filter((assignment) => assignment.accepted === null)
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const reactedAssignments = assignments
    .filter((assignment) => assignment.accepted !== null)
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Inbox</h1>
      <p className="text-muted-foreground mb-4">
        Welcome to your assignment inbox! Here you can review and respond to
        tasks that have been assigned to you. Please review the new assignments
        and take action as needed.
      </p>
      {isLoading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[8.75rem]" />
          <Skeleton className="h-[8.75rem]" />
        </div>
      )}
      {!isLoading &&
        newAssignments.length === 0 &&
        reactedAssignments.length === 0 && (
          <div className="flex h-full justify-center items-center">
            <h2 className="text-center mb-2">You have no assignments</h2>
          </div>
        )}
      {newAssignments.length > 0 && (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">New Assignments</h2>
          <AssignmentsList
            assignments={newAssignments}
            onAccept={(id) => mutate({ accepted: true, id })}
            onDecline={(id) => mutate({ accepted: false, id })}
          />
        </div>
      )}
      {reactedAssignments.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Reacted Assignments</h2>
          <AssignmentsList
            assignments={reactedAssignments}
            onAccept={(id) => mutate({ accepted: true, id })}
            onDecline={(id) => mutate({ accepted: false, id })}
          />
        </div>
      )}
    </>
  );
}
