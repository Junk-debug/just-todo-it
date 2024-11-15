'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarCheck, ListTodo, User } from 'lucide-react';

import TaskDrawer from '@/components/task-drawer';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const routes = [
  {
    children: (
      <>
        <CalendarCheck />
        <span>Today</span>
      </>
    ),
    href: '/home/today',
  },
  {
    children: (
      <>
        <ListTodo />
        <span>All tasks</span>
      </>
    ),
    href: '/home/all',
  },
  {
    children: (
      <>
        <User />
        <span>Profile</span>
      </>
    ),
    href: '/home/profile',
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    for (const route of routes) {
      router.prefetch(route.href);
    }
  }, [router]);

  return (
    <Tabs
      asChild
      value={pathname}
      onValueChange={(value) => router.push(value)}
      className="h-full"
    >
      <div className="!h-dvh flex flex-col">
        <main className="flex flex-col flex-grow overflow-y-auto px-8 pt-4">
          <TaskDrawer />
          {children}
        </main>
        <TabsList className="flex w-full justify-evenly md:hidden py-2 h-auto rounded-none">
          {routes.map(({ children, href }) => (
            <TabsTrigger
              className="data-[state=active]:!text-primary flex flex-col gap-1 items-center text-xs"
              key={href}
              value={href}
            >
              {children}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
