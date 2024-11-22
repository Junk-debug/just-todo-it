'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import TaskDrawerProvider from '@/components/task-drawer-provider';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { routes } from './routes';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Tabs asChild value={pathname} className="h-full">
      <div className="!h-dvh flex flex-col">
        <main className="flex flex-col flex-grow overflow-y-auto px-8 pt-4 pb-[4.25rem] md:pb-0">
          <TaskDrawerProvider>{children}</TaskDrawerProvider>
        </main>
        <TabsList className="flex w-full justify-evenly fixed bottom-0 md:hidden py-2 h-[4.25rem] rounded-none">
          {routes.map(({ children, href }) => (
            <TabsTrigger
              className="data-[state=active]:!text-primary flex flex-col gap-1 items-center text-xs"
              key={href}
              value={href}
              asChild
            >
              <Link href={href}>{children}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
