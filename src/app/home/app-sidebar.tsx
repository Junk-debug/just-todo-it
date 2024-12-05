'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { routes } from './routes';
import Link from 'next/link';
import { useAssignments } from './tabs-layout';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronUp, LogOut, Plus, UserIcon } from 'lucide-react';
import { useLogout } from '@/hooks/use-logout';
import { Skeleton } from '@/components/ui/skeleton';
import useUserQuery from '@/hooks/use-user-query';
import { AddTaskFlow } from '@/components/add-task-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';

const Content = () => {
  const { newAssignmentsCount, isLoading } = useAssignments();
  const pathname = usePathname();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Tasks</SidebarGroupLabel>

        <AddTaskFlow
          trigger={
            <SidebarGroupAction title="Add Task">
              <Plus /> <span className="sr-only">Add task</span>
            </SidebarGroupAction>
          }
        />

        <SidebarGroupContent>
          <SidebarMenu>
            {routes
              .filter((route) =>
                ['/home/today', '/home/all'].includes(route.href),
              )
              .map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    className={cn(
                      item.href === pathname &&
                        'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

            <AddTaskFlow
              trigger={
                <SidebarMenuButton className="hover:text-primary">
                  <Plus /> Add new task
                </SidebarMenuButton>
              }
            />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {routes
              .filter((route) =>
                ['/home/profile', '/home/inbox'].includes(route.href),
              )
              .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={cn(
                      item.href === pathname &&
                        'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
                    )}
                    asChild
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        isLoading &&
                          item.href === '/home/inbox' &&
                          'animate-pulse',
                      )}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                      {item.href === '/home/inbox' && (
                        <SidebarMenuBadge>
                          {newAssignmentsCount || ''}
                        </SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

const Footer = () => {
  const { isLoading: isUserLoading, data: user } = useUserQuery();
  const logout = useLogout();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton disabled={isUserLoading} className="!h-auto">
                {isUserLoading ? (
                  <Skeleton className="size-8 shrink-0" />
                ) : (
                  <Avatar className="size-8 rounded-md">
                    <AvatarImage src={user?.image || undefined} />
                    <AvatarFallback>
                      <UserIcon />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col text-sm leading-tight">
                  {isUserLoading ? (
                    <>
                      <Skeleton className="w-28 h-4 mb-1" />
                      <Skeleton className="w-36 h-4" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">{user?.name}</span>
                      <span className="text-xs">{user?.email}</span>
                    </>
                  )}
                </div>
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem asChild>
                <Link href="/home/profile">
                  <UserIcon />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export function AppSidebar() {
  return (
    <Sidebar>
      <Content />
      <Footer />
    </Sidebar>
  );
}
