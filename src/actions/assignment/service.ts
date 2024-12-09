import prisma from '@/prisma-client';
import { Assignment, Task, TaskRole, User } from '@prisma/client';

export type CreateAssignmentDto = Omit<
  Assignment,
  'id' | 'createdAt' | 'updatedAt' | 'accepted'
> &
  Partial<Pick<Assignment, 'accepted'>>;

export type UpdateAssignmentDto = Partial<CreateAssignmentDto>;

export type DetailedAssignment = NonNullable<
  Awaited<ReturnType<typeof getDetailedAssignmentById>>
>;

function getNewUserNonOwnerAssignmentsCount(userId: User['id']) {
  return prisma.assignment.count({
    where: {
      userId,
      accepted: null,
    },
  });
}

function getTaskAssignments(taskId: Task['id']) {
  return prisma.assignment.findMany({
    where: { taskId },
  });
}

function getUserNonOwnerAssignments(userId: User['id']) {
  return prisma.assignment.findMany({
    where: {
      userId,
      role: { not: TaskRole.OWNER },
    },
  });
}

function getDetailedUserNonOwnerAssignments(userId: User['id']) {
  return prisma.assignment.findMany({
    where: {
      userId,
      role: { not: TaskRole.OWNER },
    },
    include: {
      task: {
        include: {
          assignments: {
            where: {
              role: TaskRole.OWNER,
            },
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

function getAssignmentById(id: string) {
  return prisma.assignment.findUnique({
    where: {
      id,
    },
  });
}

function getDetailedAssignmentById(id: Assignment['id']) {
  return prisma.assignment.findUnique({
    where: {
      id,
    },
    include: {
      task: {
        include: {
          assignments: {
            where: {
              role: TaskRole.OWNER,
            },
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

function createAssignment(data: CreateAssignmentDto) {
  return prisma.assignment.create({
    data,
  });
}

function updateAssignment(id: string, data: UpdateAssignmentDto) {
  return prisma.assignment.update({
    where: {
      id,
    },
    data,
    include: {
      task: {
        include: {
          assignments: {
            where: {
              role: TaskRole.OWNER,
            },
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

async function isUserOwner(userId: User['id'], taskId: Task['id']) {
  const assignment = await prisma.assignment.findFirst({
    where: {
      userId,
      taskId,
      role: TaskRole.OWNER,
    },
  });
  return !!assignment;
}

export const assignmentService = {
  createAssignment,
  getTaskAssignments,
  getUserNonOwnerAssignments,
  getNewUserNonOwnerAssignmentsCount,
  getDetailedUserNonOwnerAssignments,
  getAssignmentById,
  getDetailedAssignmentById,
  updateAssignment,
  isUserOwner,
};
