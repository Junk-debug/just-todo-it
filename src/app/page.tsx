import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="w-full h-dvh flex items-center justify-center bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container px-4 md:px-6 py-12 space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
          Master Your Tasks, Conquer Your Day
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Our Todo app helps you organize, prioritize, and accomplish your tasks
          with ease. Stay productive and achieve your goals.
        </p>

        <Link className={cn(buttonVariants({ size: 'lg' }))} href="/home">
          Get started
        </Link>
      </div>
    </main>
  );
}
