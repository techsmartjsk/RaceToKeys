import { DefaultUser } from 'next-auth';

export type { Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User;
  }

  interface User extends Omit<DefaultUser, 'id'> {
    id: PrismaUser['id'];
    username: PrismaUser['username'];
    name: PrismaUser['name'];
    image: PrismaUser['image'];
    privateKey: PrismaUser['privateKey'];
    publicKey: PrismaUser['publicKey'];
    address: PrismaUser['address'];
  }
}
