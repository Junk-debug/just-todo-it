import { getCurrentUser } from '@/actions/auth/controller';
import TabsLayout from './tabs-layout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import TaskDrawerProvider from '@/components/task-drawer-provider';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getCurrentUser();
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <TabsLayout>
        <main className="flex flex-col flex-grow overflow-y-auto px-8 pt-4 pb-[4.25rem] md:pb-0">
          <TaskDrawerProvider>{children}</TaskDrawerProvider>
        </main>
      </TabsLayout>
    </SidebarProvider>
  );
}
