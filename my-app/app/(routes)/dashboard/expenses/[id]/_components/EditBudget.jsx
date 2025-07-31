'use client'
import React from 'react'
import { Button } from '/ui/button'
import { PenBox } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "/components/ui/dialog.jsx"
import { Input } from '/ui/input'
import  EmojiPicker  from 'emoji-picker-react'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'



function EditBudget({budgetInfo}) {
    const [openEmojiPicker, setOpenEmojiPicker] = useState()
    const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon || '')
    const [name, setName] = useState(budgetInfo?.name || '')
    const [amount, setAmount] = useState(budgetInfo?.amount || '')

    const {user} = useUser();

    const onUpdateBudget = async () => {
        if (!budgetInfo?.id) {
            toast.error('Budget information not available');
            return;
        }
        
        try {
            const response = await fetch(`/api/budgets/${budgetInfo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    amount: amount,
                    icon: emojiIcon,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast('Budget Updated');
                // Optionally refresh the page or update the UI
                window.location.reload();
            } else {
                toast.error('Failed to update budget');
            }
        } catch (error) {
            console.error('Error updating budget:', error);
            toast.error('Failed to update budget');
        }
    }

    // Don't render if budgetInfo is not available
    if (!budgetInfo) {
        return null;
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='text-white flex gap-2'><PenBox />Edit</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Budget</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <Button variant='outline'
                                    className='text-lg'
                                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>{emojiIcon}</Button>
                                <div className='absolute z-20'>
                                    <EmojiPicker open={openEmojiPicker}
                                        onEmojiClick={(e) => {
                                            setEmojiIcon(e.emoji)
                                            setOpenEmojiPicker(false)
                                        }} />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium'>Budget Name</h2>
                                    <Input type='text' placeholder='Enter Budget Name'
                                        defaultValue={budgetInfo?.name || ''}
                                        onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='mt-2'>
                                    <h2>Budget Amount</h2>
                                    <Input type='number' 
                                    defaultValue={budgetInfo?.amount || ''}
                                    placeholder='e.g. 50000$'
                                        onChange={(e) => setAmount(e.target.value)} />
                                </div>

                                <Button
                                    disabled={!(name && amount)}
                                    onClick={() => onUpdateBudget()}
                                    className='mt-5 w-full text-white'> Update Budget</Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                   
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditBudget
