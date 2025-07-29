import React from 'react'
import { TrashIcon } from 'lucide-react'
import { toast } from 'sonner'

function ExpenseListTable({ expensesList, onExpenseDeleted }) {

    const deleteExpense = async (id) => {
        try {
            const response = await fetch(`/api/expenses/${id}`, {
                method: 'DELETE',
            });
            
            const result = await response.json();
            
            if (result.success) {
                toast('Expense deleted');
                // Call the callback to refresh the parent component
                if (onExpenseDeleted) {
                    onExpenseDeleted();
                }
            } else {
                toast('Error deleting expense');
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            toast('Error deleting expense');
        }
    }

    if (!expensesList || expensesList.length === 0) {
        return (
            <div className='p-4 text-center text-gray-500'>
                No expenses yet
            </div>
        )
    }

    return (
        <div className='mt-3'>
            <div className='grid grid-cols-4 bg-slate-200 p-2'>
                <h2 className='font-bold'>Name</h2>
                <h2 className='font-bold'>Amount</h2>
                <h2 className='font-bold'>Date</h2>
                <h2 className='font-bold'>Action</h2>
            </div>
            {expensesList.map((expense, index) => (
                <div key={index} className='grid grid-cols-4 bg-slate-50 p-2'>
                    <h2>{expense.name}</h2>
                    <h2>${expense.amount}</h2>
                    <h2>{expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : 'N/A'}</h2>
                    <h2>
                        <TrashIcon 
                            className='text-red-600 cursor-pointer' 
                            onClick={() => deleteExpense(expense.id)}
                        />
                    </h2>
                </div>
            ))}
        </div>
    )
}

export default ExpenseListTable
