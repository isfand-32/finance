import React from 'react'
import Link from 'next/link'

function BudgetItem({ budget }) {
    return (
        <Link href={`/dashboard/expenses/` + budget?.id} className='block p-4 border rounded-lg hover:shadow-md transition-all duration-200 bg-white'>
            <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-3'>
                    <div className='text-xl p-2 bg-slate-100 rounded-full w-10 h-10 flex items-center justify-center'>
                        {budget?.icon}
                    </div>
                    <div>
                        <h2 className='font-semibold text-gray-900'>{budget.name}</h2>
                        <p className='text-sm text-gray-500'>{budget.expenseCount || 0} Item</p>
                    </div>
                </div>
                <h2 className='text-lg font-bold text-primary'>${budget.amount}</h2>
            </div>

            <div className='space-y-2'>
                <div className='flex items-center justify-between text-xs text-gray-500'>
                    <span>${budget.totalSpend ? budget.totalSpend : 0} Spent</span>
                    <span>${budget.amount - (budget.totalSpend || 0)} Remaining</span>
                </div>
                <div className='w-full bg-slate-200 h-1.5 rounded-full overflow-hidden'>
                    <div
                        className='bg-primary h-full rounded-full transition-all duration-300'
                        style={{
                            width: `${budget.amount > 0 ? Math.min((budget.totalSpend || 0) / budget.amount * 100, 100) : 0}%`
                        }}
                    />
                </div>
            </div>
        </Link>
    )
}

export default BudgetItem
