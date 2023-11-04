import { authOptions } from '@/authentication/auth';
import { getServerSession } from 'next-auth';
import React from 'react';
import { LoginWithXButton } from '../auth/login';

export const Protected = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession(authOptions);

  if (!session) return <LoginWithXButton />;

  return <>{children}</>;
};