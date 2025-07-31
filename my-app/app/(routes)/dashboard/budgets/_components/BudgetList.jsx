'use client'
import React, { useState, useEffect } from 'react'
import CreateBudget from './CreateBudget'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem'

export default function BudgetList() {
  const [budgetList, setBudgetList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  
  useEffect(() => {
    user && getBudgetList();
  }, [user])

  /**
   * Used to get the budget list
   */
  const getBudgetList = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/budgets?email=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch budgets');
      }
      
      const result = await response.json();
      setBudgetList(result);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-6'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        <CreateBudget refreshData={getBudgetList} />
        {!loading && budgetList?.length > 0 ? budgetList.map((budget, index) => (
          <BudgetItem key={index} budget={budget} />
        )) : [1, 2, 3, 4, 5].map((item, index) => (
          <div key={index} className='w-full bg-slate-200 rounded-lg h-[120px] animate-pulse'>
          </div>
        ))}
      </div>
    </div>
  )
}

