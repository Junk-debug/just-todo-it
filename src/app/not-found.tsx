import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        <h1 className="text-8xl sm:text-9xl font-extrabold tracking-tighter text-primary mb-2 sm:mb-4">
          404
        </h1>
        <p className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">
          Page not found
        </p>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
          We couldn&apos;t find the page you&apos;re looking for.
        </p>

        <Link className={cn(buttonVariants({ variant: 'outline' }))} href="/">
          Go back home
        </Link>
      </div>
    </div>
  );
}
