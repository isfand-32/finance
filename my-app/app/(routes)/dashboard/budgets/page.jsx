"use client"

import React from 'react'
import BudgetList from './_components/BudgetList'

function BudgetsPage() {
  return (
    <div className='p-10'>
      <h2 className='text-3xl font-bold'>My budgets</h2>
      <BudgetList/>
    </div>
  )
}

export default BudgetsPage 