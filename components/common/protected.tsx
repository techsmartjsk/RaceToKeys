import { authOptions } from '@/authentication/auth';
import { getServerSession } from 'next-auth';
import React from 'react';
import { LoginPage } from '../auth/login.page';

export const Protected = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession(authOptions);

  if (!session) return <LoginPage />;

  return <>{children}</>;
};