import prisma from '@/prisma-client';
import { PushSubscription, User } from '@prisma/client';

type CreateSubscriptionDto = Omit<PushSubscription, 'userId' | 'id'>;

const createSubscription = (
  userId: User['id'],
  data: CreateSubscriptionDto,
) => {
  return prisma.pushSubscription.create({
    data: {
      userId,
      ...data,
    },
  });
};

const getUserSubscriptions = (userId: User['id']) => {
  return prisma.pushSubscription.findMany({
    where: {
      userId,
    },
  });
};

const getSubscriptionByUserIdAndEndpoint = ({
  userId,
  endpoint,
}: {
  userId: User['id'];
  endpoint: PushSubscription['endpoint'];
}) => {
  return prisma.pushSubscription.findUnique({
    where: {
      userId_endpoint: {
        userId,
        endpoint,
      },
    },
  });
};

const deleteSubscriptionById = (id: PushSubscription['id']) => {
  return prisma.pushSubscription.delete({
    where: {
      id,
    },
  });
};

const deleteSubscriptionByUserIdAndEndpoint = ({
  userId,
  endpoint,
}: {
  userId: User['id'];
  endpoint: PushSubscription['endpoint'];
}) => {
  return prisma.pushSubscription.delete({
    where: {
      userId_endpoint: {
        userId,
        endpoint,
      },
    },
  });
};

export const subscriptionService = {
  createSubscription,
  getUserSubscriptions,
  getSubscriptionByUserIdAndEndpoint,
  deleteSubscriptionById,
  deleteSubscriptionByUserIdAndEndpoint,
};
