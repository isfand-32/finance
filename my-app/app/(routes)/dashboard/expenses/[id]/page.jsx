'use client'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import BudgetItem from '../../budgets/_components/BudgetItem'
import AddExpense from './_components/AddExpense'
import ExpenseListTable from './_components/ExpenseListTable'
import { Button } from '/ui/button'
import { PenBox, Trash } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "/ui/alert-dialog"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import EditBudget from './_components/EditBudget'





function ExpensesPage({ params }) {
    const { user } = useUser();
    const unwrappedParams = React.use(params);
    const [budgetInfo, setBudgetInfo] = useState();
    const [expensesList, setExpensesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const route = useRouter();

    useEffect(() => {
        user && getBudgetInfo();
    }, [user]);

    useEffect(() => {
        if (budgetInfo) {
            getExpenses();
        }
    }, [budgetInfo]);

    const getBudgetInfo = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/budgets/${unwrappedParams.id}?email=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch budget info');
            }

            const result = await response.json();
            setBudgetInfo(result);
        } catch (error) {
            console.error('Error fetching budget info:', error);
        } finally {
            setLoading(false);
        }
    };

    const getExpenses = async () => {
        try {
            const response = await fetch(`/api/expenses?budgetId=${unwrappedParams.id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch expenses');
            }

            const result = await response.json();
            setExpensesList(result);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const handleExpenseDeleted = () => {
        // Refresh both budget info and expenses list
        getBudgetInfo();
        getExpenses();
    };

    //delete budget
    const deleteBudget = async () => {
        try {
            const response = await fetch(`/api/budgets/${unwrappedParams.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete budget');
            }

            const result = await response.json();
            toast.success(result.message || 'Budget deleted successfully');
            route.replace('/dashboard/budgets');
        } catch (error) {
            console.error('Error deleting budget:', error);
            toast.error(error.message || 'Failed to delete budget. Please try again.');
        }
    }


    return (
        <div className='p-10'>
            <h2 className='text-2xl font-bold flex justify-between items-center'>My expenses

                <div className='flex gap-2 items-center'>
                    {budgetInfo && <EditBudget budgetInfo={budgetInfo}/>}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className='flex gap bg-red-600 text-white'><Trash />Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your budget
                                    along with expensesfrom our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteBudget()} className='text-white'>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
                {!loading && budgetInfo ? <BudgetItem budget={budgetInfo} /> :
                    <div className='w-full bg-slate-200 rounded-lg h-[150px] animate-pulse'>
                    </div>}
                <AddExpense budgetId={unwrappedParams.id} user={user} onExpenseAdded={handleExpenseDeleted} />
            </div>

            {/* Expenses List */}
            <div className='mt-8'>
                <h3 className='text-xl font-semibold mb-4'>Expenses List</h3>
                <ExpenseListTable
                    expensesList={expensesList}
                    onExpenseDeleted={handleExpenseDeleted}
                />
            </div>
        </div>
    )
}

export default ExpensesPage
