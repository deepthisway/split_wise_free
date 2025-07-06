"use client";
import { useStoreUser } from '@/hooks/use-store-users';
import { SignedOut, SignIn, SignInButton, SignUp, SignUpButton } from '@clerk/nextjs'
import React from 'react'
import {BarLoader} from 'react-spinners';

const Header = () => {
  const {isLoading} = useStoreUser();

  return (
    <header className="fixed top-0 w-full border-b bg-white/95 backdrop-blur z-50 supports-[backdrop-filter]:bg-white/60">
      <h1>Evenly</h1>
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-4 py-2">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
      </nav>
      {isLoading && 
        <BarLoader width={"100%"} color='#36d7b7' />
      }
    </header>
  );
}

export default Header