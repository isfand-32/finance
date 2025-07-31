"use client"

import React from 'react'
import { UserButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import CardInfo from './_components/CardInfo'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BarChartDashboard from './_components/BarChartDashboard'
import BudgetItem from './budgets/_components/BudgetItem'


function Dashboard() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const getBudgetList = async () => {
    try {
      setLoading(true);
      console.log('Fetching budgets for user:', user?.primaryEmailAddress?.emailAddress);
      const response = await fetch(`/api/budgets?email=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch budgets');
      }

      const result = await response.json();
      console.log('Budgets fetched:', result);
      setBudgetList(result);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    console.log('useEffect triggered, user:', user);
    console.log('User email:', user?.primaryEmailAddress?.emailAddress);
    if (user?.primaryEmailAddress?.emailAddress) {
      console.log('Calling getBudgetList...');
      getBudgetList();
    } else {
      console.log('No user email available yet');
    }
  }, [user]);

  return (
    <div className='p-5'>
      <h2 className='text-3xl font-bold'>Hi {user?.fullName}</h2>
      <p className='text-lg text-gray-500'>Here is where you can manage your finances</p>
      <CardInfo budgetList={budgetList} />
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='md:col-span-2 '>
          <BarChartDashboard
            budgetList={budgetList} />
        </div>
        <div className='gap-3'>
          <h2 className='text-lg font-bold'>Latest Budgets</h2>
         {budgetList.map((budget, index )=>(
          <BudgetItem budget={budget} key={index}/>
         ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
