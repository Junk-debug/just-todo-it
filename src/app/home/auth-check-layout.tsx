'use client';

import useUserQuery from '@/hooks/user/use-user-query';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export const AuthCheckLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: user, isLoading, error } = useUserQuery();

  useEffect(() => {
    if ((!isLoading && !user) || error) {
      signOut();
    }
  }, [user, isLoading, error]);

  return <>{children}</>;
};
