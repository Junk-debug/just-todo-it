'use server';

import { Assignment, Task, TaskRole, User } from '@prisma/client';
import { assignmentService } from './service';
import { userService } from '../user/service';
import { requireAuth } from '../auth/middlewares';
import { createServerAction, ServerActionError } from '@/lib/safe-action';

export const shareTask = createServerAction(
  async ({
    taskId,
    role,
    email,
  }: {
    taskId: Task['id'];
    role: TaskRole;
    email: User['email'];
  }) => {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      throw new ServerActionError('User not found.');
    }

    return assignmentService.createAssignment({
      taskId,
      role,
      userId: user.id,
    });
  },
);

export const getNewNonOwnerAssignmentsCount = requireAuth(
  async ({ session }) => {
    return assignmentService.getNewUserNonOwnerAssignmentsCount(
      session.user.id,
    );
  },
);

export const getTaskAssignments = requireAuth(async (_, taskId: Task['id']) => {
  return assignmentService.getTaskAssignments(taskId);
});

export const getNonOwnerAssignments = requireAuth(async ({ session }) => {
  return assignmentService.getUserNonOwnerAssignments(session.user.id);
});

export const getDetailedNonOwnerAssignments = requireAuth(
  async ({ session }) => {
    return assignmentService.getDetailedUserNonOwnerAssignments(
      session.user.id,
    );
  },
);

export type UpdateAcceptedStatusDto = {
  id: Assignment['id'];
  accepted: Assignment['accepted'];
};

export const updateAssignmentAcceptedStatus = createServerAction(
  requireAuth(
    async ({ session }, { id, accepted }: UpdateAcceptedStatusDto) => {
      const userId = session.user.id;

      const assignment = await assignmentService.getAssignmentById(id);

      if (!assignment || assignment.userId !== userId) {
        throw new ServerActionError('Unauthorized');
      }

      return assignmentService.updateAssignment(id, {
        accepted,
      });
    },
  ),
);
