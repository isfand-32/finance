'use client'
import React, { useState, useEffect } from 'react'
import CreateBudget from './CreateBudget'
import { useUser } from '@clerk/nextjs'
import { sql, eq, desc } from 'drizzle-orm'
import { db } from '/lib/db'
import { budgets, Expenses } from '/lib/db/schema'
import BudgetItem from './BudgetItem'
import { getTableColumns } from 'drizzle-orm'

export default function BudgetList() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  /**
   * Used to get the budget list
   */
  const getBudgetList = async () => {
   
    const result = await db.select({
      ...getTableColumns(budgets),
      totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalBudget: sql`count(${Expenses.id})`.mapWith(Number),
    })
    .from(budgets)
    .leftJoin(Expenses, eq(budgets.id, Expenses.budgetId))
    .where(eq(budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
    .groupBy(budgets.id)
    .orderBy(desc(budgets.id));
    setBudgetList(result);
  };

  return (
    <div className='mt-7'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateBudget refreshData={getBudgetList}/>
        {budgetList?.length > 0 ? budgetList.map((budget, index) => (
          <BudgetItem key={index} budget={budget} />
        )) : [1,2,3,4,5].map((item, index) => (
          <div key={index} className='w-full bg-slate-200 rounded-lg h-[150px] animate-pulse'>
          </div>
        ))}
      </div>
    </div>
  )
}

