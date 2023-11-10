import { buyKeys } from '@/lib/contract';
import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { AptosAccount } from 'aptos';
import { NextAuthOptions, getServerSession } from 'next-auth';
import TwitterProvider, { TwitterProfile } from 'next-auth/providers/twitter';
import { User, UserInfo } from '@/lib/types'

async function getUserFromAccount(provider: string, providerAccountId: string): Promise<User | null> {
  const account = await prisma.account.findFirst({
    where: {
      provider: provider,
      providerAccountId: providerAccountId,
    },
    select: {
      user: true,
    },
  });

  if (account) {
    const user: User = account.user;
    return user;
  } else {
    return null; // If no account is found
  }
}


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID as string,
      clientSecret: process.env.TWITTER_SECRET as string,
      version:'2.0',
      profile(profile: TwitterProfile){
        const wallet = new AptosAccount();
        const privateKey = wallet.toPrivateKeyObject().privateKeyHex;
        const publicKey = wallet.pubKey();
        const pubKey = publicKey['hexString'];
        const address = wallet.address();
        const addressAcc = address['hexString']
      
        return {
          id: profile.data.id,
          username: profile.data.username,
          name: profile.data.name ?? '',
          image: profile.data.profile_image_url ?? '',
          publicKey:pubKey,
          privateKey: privateKey,
          address: addressAcc
        };
      },
    }),
  ],
  callbacks:{
    async session({ session, user }) {
      return {
        ...session,
        user: {
          id: user.id,
          username: user.username,
          privateKey: user.privateKey,
          publicKey: user.publicKey,
          name: user.name,
          image: user.image,
          address: user.address
        },
      };
    },
  },
  events: {
    async signIn({ account, isNewUser }) {
      try {
        if (account) {
          const foundAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: 'twitter',
                providerAccountId: account.providerAccountId,
              },
            },
            select:{
              user: true,
            }
          });

          if (account?.provider === 'twitter' && isNewUser) {
            try {
              const user = await getUserFromAccount(account.provider,account.providerAccountId)
              if(user){
                console.log(user)
                await buyKeys(user, user.address, 1);
              }
            } catch (error) {
              console.error('Error executing function on user login:', error);
            }
          }

          if (foundAccount) {
            await prisma.account.update({
              where: {
                provider_providerAccountId: {
                  provider: 'twitter',
                  providerAccountId: account.providerAccountId,
                },
              },
              data: {
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
              },
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);