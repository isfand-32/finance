"use client"

import React, { useEffect } from 'react'
import Image from 'next/image'
import { LayoutGrid, PiggyBank, Receipt, ShieldCheck } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

function SideNav() {
    const menuList = [
        {
            id:1,
            name:'Dashboard',
            icon: LayoutGrid,
            path: '/dashboard'
        },
        {
            id:2,
            name:'Budgets',
            icon: PiggyBank,
            path: '/dashboard/budgets'

        },
        {
            id:3,
            name:'Expenses',
            icon: Receipt,
            path: '/dashboard/expenses'

        },
    ]

    const path = usePathname();

    useEffect(()=>{
        console.log(path)
    }, [path])
    

  return (
    <div className='h-screen p-5 border shadow:sm'>
        <Image 
            src={'/logo.svg'} 
            alt='logo' 
            width={160} 
            height={100} 
            priority
            style={{ width: 'auto', height: 'auto' }}
        />
        <div className='mt-5'>
            {menuList.map((menu) => (
                <Link key={menu.id} href={menu.path}>
                <h2 className={`flex items-center gap-2 text-gray-600 font-medium mb-2 p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100 ${path==menu.path&& 'text-primary bg-blue-100'}`}>
                    <menu.icon className="w-5 h-5" />
                    {menu.name}
                </h2>
                </Link>
            ))}
        </div>
        <div className='fixed bottom-7 p-5 flex gap-2 items-center'>
            <UserButton/>
            <p className='text-gray-600 font-medium'>Profile</p>
        </div>
    </div>
  )
}

export default SideNav
