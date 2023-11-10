import { authOptions, getServerAuthSession } from '@/authentication/auth';
import React from 'react';
import { LoginPage } from '../auth/login.page';

export const Protected = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerAuthSession();

  if (!session) return <LoginPage />;

  return <>{children}</>;
};