'use server';

import { Assignment, Task, TaskRole, User } from '@prisma/client';
import { assignmentService } from './service';
import { userService } from '../user/service';
import { requireAuth } from '../auth/middlewares';
import { createServerAction, ServerActionError } from '@/lib/safe-action';
import { sendNotification } from '../notification/controller';
import prisma from '@/prisma-client';

export const shareTask = createServerAction(
  requireAuth(
    async (
      { session },
      {
        taskId,
        role,
        email,
      }: {
        taskId: Task['id'];
        role: TaskRole;
        email: User['email'];
      },
    ) => {
      const ownerId = session.user.id;
      const isOwner = await assignmentService.isUserOwner(ownerId, taskId);

      if (!isOwner) {
        throw new ServerActionError('Unauthorized');
      }

      const owner = await userService.getUserById(ownerId);

      if (!owner) {
        throw new ServerActionError('Owner not found.');
      }

      const user = await userService.getUserByEmail(email);

      if (!user) {
        throw new ServerActionError('User not found.');
      }

      if (
        await prisma.assignment.findUnique({
          where: {
            taskId_userId: {
              taskId,
              userId: user.id,
            },
          },
        })
      ) {
        throw new ServerActionError('User already has this task.');
      }

      const assignment = assignmentService.createAssignment({
        taskId,
        role,
        userId: user.id,
      });

      await sendNotification({
        url: process.env.AUTH_URL + '/home/inbox',
        userId: user.id,
        title: 'You have a new task assignment',
        message: `${owner.name} has shared a new task for you.`,
      });

      return assignment;
    },
  ),
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
