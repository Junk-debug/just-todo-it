'use server';

import { requireAuth } from '@/actions/auth/middlewares';
import { subscriptionService } from '@/actions/notification/service';
import { User } from '@prisma/client';
import webpush from 'web-push';
import { z } from 'zod';

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

const subscriptionSchema = z.object({
  endpoint: z.string(),
  keys: z.object({
    auth: z.string(),
    p256dh: z.string(),
  }),
});

export const subscribeUser = requireAuth(
  async ({ session }, data: PushSubscriptionJSON) => {
    const sub = subscriptionSchema.parse(data);
    const subscription = await subscriptionService.createSubscription(
      session.user.id,
      {
        auth: sub.keys.auth,
        p256dh: sub.keys.p256dh,
        endpoint: sub.endpoint,
      },
    );
    return subscription;
  },
);

export const unsubscribeUser = requireAuth(
  async ({ session }, endpoint: string) => {
    await subscriptionService.deleteSubscriptionByUserIdAndEndpoint({
      userId: session.user.id,
      endpoint,
    });
    return { success: true };
  },
);

export async function sendNotification({
  userId,
  title,
  message,
  url,
}: {
  userId: User['id'];
  title: string;
  message: string;
  url: string;
}) {
  const data = await subscriptionService.getUserSubscriptions(userId);

  if (data.length === 0) {
    return;
    throw new Error('No subscription available');
  }

  for (const sub of data) {
    const subscription = {
      endpoint: sub.endpoint,
      keys: {
        auth: sub.auth,
        p256dh: sub.p256dh,
      },
    };

    try {
      console.log('Sending notification to:', sub);
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: title,
          body: message,
          url,
          icon: '/favicon.svg',
        }),
      );
    } catch (error) {
      console.error(
        'Error sending push notification to subscription:',
        sub.endpoint,
        error,
      );
    }
  }

  // const subscription = {
  //   endpoint: data.endpoint,
  //   keys: {
  //     auth: data.auth,
  //     p256dh: data.p256dh,
  //   },
  // };

  // try {
  //   await webpush.sendNotification(
  //     subscription,
  //     JSON.stringify({
  //       title: 'Test Notification',
  //       body: message,
  //       icon: '/icon.png',
  //     }),
  //   );
  //   return { success: true };
  // } catch (error) {
  //   console.error('Error sending push notification:', error);
  //   return { success: false, error: 'Failed to send notification' };
  // }
}
