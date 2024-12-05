import { verifyUser } from '@/actions/auth/controller';

import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { createServerActionHandler } from '@/lib/safe-action';
import { cn } from '@/lib/utils';

import Link from 'next/link';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function VerificationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  let message = 'Verifying email...';
  let verified = false;
  const { token } = await searchParams;

  try {
    await createServerActionHandler(verifyUser)(
      Array.isArray(token) || !token ? '' : token,
    );

    message = 'Email verified successfully!';
    verified = true;
  } catch (error) {
    message = (error as Error).message;
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-balance text-muted-foreground">
            {message}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          {verified && (
            <Link className={cn(buttonVariants())} href={'/auth/login'}>
              Sign in
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
