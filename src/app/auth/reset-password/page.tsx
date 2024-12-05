import ChangePasswordForm from './reset-password-form';
import { CircleAlert } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { token } = await searchParams;

  if (!token || Array.isArray(token)) {
    return (
      <>
        <span className="flex items-center gap-2 mb-4">
          <CircleAlert /> There is no token in this url
        </span>
        <Link className={cn(buttonVariants())} href={'/auth/login'}>
          Back to sign in
        </Link>
      </>
    );
  }

  return (
    <div className="min-w-64 w-72 flex flex-col space-y-4">
      <div className="mb-4">
        <h1 className="text-center tracking-tight text-3xl font-semibold mb-2">
          Password reset
        </h1>
        <p className="text-center text-muted-foreground">
          Provide your new password
        </p>
      </div>
      <ChangePasswordForm token={token} />
    </div>
  );
}
