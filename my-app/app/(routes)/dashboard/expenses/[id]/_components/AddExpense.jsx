import React from 'react'
import { Input } from "/ui/input.jsx"
import { useState } from 'react'
import { Button } from "/ui/button.jsx"
import { toast } from "sonner"



function AddExpense({budgetId, user, onExpenseAdded}) {


    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const addNewExpense = async()=>{
        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    amount: amount,
                    budgetId: budgetId,
                }),
            });

            setAmount('');
            setName('');
            const result = await response.json();
            console.log(result);
            if (result.success) {
                toast.success('Expense added successfully');
                setName('');
                setAmount('');
                // Call the callback to refresh the parent component
                if (onExpenseAdded) {
                    onExpenseAdded();
                }
            } else {
                toast.error('Failed to add expense');
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            toast.error('Failed to add expense');
        }
    }
    
    return (
        <div className='p-5 border rounded-lg'>
            <h2 className='font-bold text-lg'>Add Expense</h2>
            <div className='mt-3'>
                <h2 className='text-black font-medium my-1'>Expense Name</h2>
                <Input placeholder='Enter Budget Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='mt-3'>
                <h2 className='text-black font-medium my-1'>Expense Amount</h2>
                <Input placeholder='e.g. 1000$'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} />
            </div>
            <Button disabled={!(name&&amount)} 
            onClick={()=>addNewExpense()}
            className='mt-3 text-white w-full'>Add New Expense</Button>
        </div>
    )
}

export default AddExpense
