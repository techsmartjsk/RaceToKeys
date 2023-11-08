'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

export const LoginLayout = () => {
  return (
    <div className='flex flex-col gap-10 items-center justify-center'>
      <h1 className='uppercase font-[500] text-4xl'>Join Network</h1>
      <h2 className="text-xl">The first decentralized social network that pays you to post.</h2>
      <button
        className='flex w-[300px] flex-row items-center justify-center space-x-3 rounded-xl bg-[#26a7de] px-9 py-3 font-matter text-white'
        onClick={() => signIn('twitter')}
      >
        <Image
          src='/twitter.svg'
          alt='Twitter'
          className='h-6 w-6'
          height={24}
          width={24}
        />
        <p className='text-lg'>Sign in with Twitter</p>
      </button>
    </div>
  );
};