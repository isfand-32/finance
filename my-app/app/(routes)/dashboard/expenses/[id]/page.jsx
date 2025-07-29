'use client'
import React from 'react'
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { db } from '/lib/db'
import { getTableColumns } from 'drizzle-orm'
import { budgets, Expenses } from '/lib/db/schema'
import { sql, eq } from 'drizzle-orm'
import BudgetItem from '../../budgets/_components/BudgetItem'
import AddExpense from './_components/AddExpense'

function ExpensesPage({ params }) {
    const { user } = useUser();
    const unwrappedParams = React.use(params);
    const [budgetInfo, setBudgetInfo] = useState();
    
    useEffect(() => {
        user && getBudgetInfo();
    }, [user, unwrappedParams]);

    const getBudgetInfo = async () => {
        const result = await db.select({
            ...getTableColumns(budgets),
            totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
            totalBudget: sql`count(${Expenses.id})`.mapWith(Number),
        })
            .from(budgets)
            .leftJoin(Expenses, eq(budgets.id, Expenses.budgetId))
            .where(eq(budgets.id, unwrappedParams.id))
            .where(eq(budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .groupBy(budgets.id)

            setBudgetInfo(result[0]);
    }

    return (
        <div className='p-10'>
            <h2 className='text-2xl font-bold'>My expenses</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
               {budgetInfo? <BudgetItem budget={budgetInfo}/>:
               <div className='w-full bg-slate-200 rounded-lg h-[150px] animate-pulse'>
            </div>}
            <AddExpense/>
        </div>
    </div>
    )
}

export default ExpensesPage
