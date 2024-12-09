'use client';

import { useState, useEffect, memo } from 'react';
import {
  subscribeUser,
  unsubscribeUser,
} from '@/actions/notification/controller';
import { toast } from 'sonner';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

function PushNotificationManager() {
  // const { data: registration } = useQuery({
  //   queryKey: [QueryKey.PUSH, QueryKey.REGISTRATION],
  //   queryFn: async () => {
  //     if (!('serviceWorker' in navigator))
  //       toast.error(
  //         'Service worker is not available. Push notifications will not work',
  //       );
  //     else {
  //       const registration = await navigator.serviceWorker.getRegistration();
  //       return registration || null;
  //     }
  //   },
  // });

  // const {
  //   data: subscription,
  //   refetch,
  //   status,
  // } = useQuery({
  //   enabled: !!registration,
  //   queryKey: ['push', 'subscription'],
  //   queryFn: () => {
  //     return registration?.pushManager?.getSubscription() || null;
  //   },
  // });

  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(false);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  const toggleSubscribe = async () => {
    setIsLoading(true);
    if (subscription) {
      await subscription?.unsubscribe();
      await unsubscribeUser(subscription?.endpoint || '');
      setSubscription(null);

      toast.info('Unsubscribed from push notifications');
    } else {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });
      setSubscription(sub);

      console.log(sub.toJSON());

      await subscribeUser(sub.toJSON());

      toast.info('Subscribed to push notifications');
    }
    setIsLoading(false);
  };

  if (!isSupported) {
    return null;
  }

  console.log(subscription);

  return (
    <Label className="flex items-center gap-1 w-full justify-between">
      Push notifications
      <Switch
        disabled={isLoading}
        checked={!!subscription}
        onCheckedChange={() => toggleSubscribe()}
      />
    </Label>
  );
}

export const NotificationsButton = memo(PushNotificationManager);
