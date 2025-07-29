import React from 'react'
import { Input } from "/ui/input"
import { useState } from 'react'
import { Button } from "/ui/button"
import { toast } from "sonner"


function AddExpense({budgetId, user}) {


    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const addNewExpense = async()=>{
        const result = await db.insert(Expenses).values({
            name: name,
            amount: amount,
            budgetId: budgetId,
            createdAt:  user?.primaryEmailAddress?.emailAddress
        }).returning({insertedId: budgets.id});

        console.log(result);
        if (result) {
            toast.success('Expense added ');
        }
    }
    
    return (
        <div className='p-5 border rounded-lg'>
            <h2 className='font-bold text-lg'>Add Expense</h2>
            <div className='mt-3'>
                <h2 className='text-black font-medium my-1'>Expense Name</h2>
                <Input placeholder='Enter Budget Name'
                    onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='mt-3'>
                <h2 className='text-black font-medium my-1'>Expense Amount</h2>
                <Input placeholder='e.g. 1000$'
                    onChange={(e) => setAmount(e.target.value)} />
            </div>
            <Button disabled={!(name&&amount)} 
            onClick={()=>addNewExpense()}
            className='mt-3 text-white w-full'>Add New Expense</Button>
        </div>
    )
}

export default AddExpense
