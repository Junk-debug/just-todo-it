'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { getDetailedNonOwnerAssignments } from '@/actions/assignment/controller';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { routes } from './routes';

export const useAssignments = () => {
  const { data: assignments, isLoading } = useQuery({
    queryFn: getDetailedNonOwnerAssignments,
    queryKey: ['assignments'],
  });

  const acceptedAssignments = assignments?.filter(
    (assignment) => assignment.accepted,
  );

  const declinedAssignments = assignments?.filter(
    (assignment) => !assignment.accepted,
  );

  const newAssignments = assignments?.filter(
    (assignment) => assignment.accepted === null,
  );

  const newAssignmentsCount = newAssignments?.length || 0;

  const showNewAssignmentsIndicator = newAssignmentsCount > 0;

  return {
    assignments,
    acceptedAssignments,
    declinedAssignments,
    showNewAssignmentsIndicator,
    newAssignmentsCount,
    isLoading,
  };
};

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { showNewAssignmentsIndicator, isLoading } = useAssignments();

  return (
    <Tabs asChild value={pathname} className="h-full">
      <div className="!h-dvh w-full flex flex-col">
        {children}
        <TabsList className="flex w-full justify-evenly fixed bottom-0 md:hidden py-2 h-auto min-h-[4.25rem] rounded-none border-b-[env(safe-area-inset-bottom)] border-muted">
          {routes.map(({ icon: Icon, title, href }) => (
            <TabsTrigger
              className="data-[state=active]:!text-primary min-w-[4.625rem] flex flex-col gap-1 items-center text-xs"
              key={href}
              value={href}
              asChild
            >
              <Link href={href}>
                <div className="relative">
                  {showNewAssignmentsIndicator && href === '/home/inbox' && (
                    <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary" />
                  )}
                  <Icon
                    className={
                      isLoading && href === '/home/inbox' ? 'animate-pulse' : ''
                    }
                  />
                </div>
                <span>{title}</span>
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
