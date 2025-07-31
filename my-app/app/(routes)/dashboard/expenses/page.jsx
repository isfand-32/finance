'use client'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import ExpenseListTable from './[id]/_components/ExpenseListTable'
import { Button } from '/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

function ExpensesPage() {
    const { user } = useUser();
    const [expensesList, setExpensesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [budgetList, setBudgetList] = useState([]);
    const route = useRouter();

    useEffect(() => {
        if (user) {
            getAllExpenses();
            getBudgetList();
        }
    }, [user]);

    const getBudgetList = async () => {
        try {
            const response = await fetch(`/api/budgets?email=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch budgets');
            }

            const result = await response.json();
            setBudgetList(result);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    };

    const getAllExpenses = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/expenses/all?email=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch expenses');
            }

            const result = await response.json();
            setExpensesList(result);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            toast.error('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    };

    const deleteExpense = async (id) => {
        try {
            const response = await fetch(`/api/expenses/${id}`, {
                method: 'DELETE',
            });
            
            const result = await response.json();
            
            if (result.success) {
                toast.success('Expense deleted successfully');
                getAllExpenses(); // Refresh the list
            } else {
                toast.error('Error deleting expense');
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            toast.error('Error deleting expense');
        }
    };

    const handleExpenseDeleted = () => {
        getAllExpenses();
    };

    const handleAddExpense = () => {
        if (budgetList.length === 0) {
            toast.error('Please create a budget first before adding expenses');
            route.push('/dashboard/budgets');
            return;
        }
        
        // Navigate to the first budget's expenses page to add an expense
        route.push(`/dashboard/expenses/${budgetList[0].id}`);
    };

    return (
        <div className='p-10'>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold'>All Expenses</h2>
            </div>

            {loading ? (
                <div className='w-full bg-slate-200 rounded-lg h-[200px] animate-pulse flex items-center justify-center'>
                    <p className='text-gray-500'>Loading expenses...</p>
                </div>
            ) : expensesList.length === 0 ? (
                <div className='text-center py-10'>
                    <p className='text-gray-500 text-lg mb-4'>No expenses found</p>
                    <p className='text-gray-400 mb-6'>Start by creating a budget and adding some expenses</p>
                    <Button 
                        onClick={() => route.push('/dashboard/budgets')}
                        className='bg-primary text-white'
                    >
                        Create Budget
                    </Button>
                </div>
            ) : (
                <div className='bg-white rounded-lg shadow-sm border'>
                    <div className='p-4 border-b'>
                        <h3 className='text-lg font-semibold'>Total Expenses: {expensesList.length}</h3>
                        <p className='text-gray-500'>
                            Total Amount: ${expensesList.reduce((sum, expense) => sum + parseFloat(expense.amount), 0).toFixed(2)}
                        </p>
                    </div>
                    <div className='p-4'>
                        <div className='grid grid-cols-5 bg-slate-200 p-3 rounded-t-lg font-semibold'>
                            <h2>Name</h2>
                            <h2>Amount</h2>
                            <h2>Budget</h2>
                            <h2>Date</h2>
                            <h2>Actions</h2>
                        </div>
                        {expensesList.map((expense, index) => (
                            <div key={expense.id || index} className='grid grid-cols-5 bg-slate-50 p-3 border-b last:border-b-0 hover:bg-slate-100 transition-colors'>
                                <h2 className='font-medium'>{expense.name}</h2>
                                <h2 className='text-green-600 font-semibold'>${expense.amount}</h2>
                                <h2 className='text-blue-600'>{expense.budgetName}</h2>
                                <h2>{expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : 'N/A'}</h2>
                                <h2>
                                    <Trash2 
                                        className='text-red-600 cursor-pointer hover:text-red-800 transition-colors' 
                                        size={20}
                                        onClick={() => deleteExpense(expense.id)}
                                    />
                                </h2>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ExpensesPage 