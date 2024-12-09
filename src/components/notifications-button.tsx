'use client';

import { useState, useEffect } from 'react';
import {
  subscribeUser,
  unsubscribeUser,
} from '@/actions/notification/controller';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';

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

export function PushNotificationManager() {
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
    if (subscription) {
      await subscription?.unsubscribe();
      await unsubscribeUser(subscription?.endpoint || '');
      setSubscription(null);
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
    }
  };

  // async function sendTestNotification() {
  //   // if (subscription) {
  //   await sendNotification({
  //     userId: '6d0392c3-fbeb-4ac1-a46d-49fe8f98e40b',
  //     message,
  //   });
  //   setMessage('');
  //   // }
  // }

  if (!isSupported) {
    return null;
  }

  return (
    <>
      <Button size={'icon'} onClick={toggleSubscribe}>
        {subscription ? <Bell /> : <BellOff />}
      </Button>
    </>
  );
}

// export function InstallPrompt() {
//   const [isIOS, setIsIOS] = useState(false);
//   const [isStandalone, setIsStandalone] = useState(false);

//   useEffect(() => {
//     setIsIOS(
//       /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
//     );

//     setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
//   }, []);

//   if (isStandalone) {
//     return null; // Don't show install button if already installed
//   }

//   return (
//     <div>
//       <h3>Install App</h3>
//       <button>Add to Home Screen</button>
//       {isIOS && (
//         <p>
//           To install this app on your iOS device, tap the share button
//           <span role="img" aria-label="share icon">
//             {' '}
//             ⎋{' '}
//           </span>
//           and then &quot;Add to Home Screen&quot;
//           <span role="img" aria-label="plus icon">
//             {' '}
//             ➕{' '}
//           </span>
//           .
//         </p>
//       )}
//     </div>
//   );
// }
