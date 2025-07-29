"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../../ui/button'
import { UserButton, useUser } from '@clerk/nextjs'

function Header() {
  const { isSignedIn } = useUser();

  return (
    <div className='p-5 flex justify-between items-center border shadow-md'>
      <Image src={'./logo.svg'}
      alt='logo'
      width={160}
      height={100}
      priority
      style={{ width: 'auto', height: 'auto' }}
      />
      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <UserButton signOutUrl="/" />
        ) : (
          <Link href="/auth/sign-up">
            <Button className="text-white bg-primary">Get Started</Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Header
