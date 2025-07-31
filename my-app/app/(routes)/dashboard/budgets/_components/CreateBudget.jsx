'use client'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "/components/ui/dialog.jsx"
import EmojiPicker from 'emoji-picker-react'
import { Button } from "/ui/button.jsx"
import { Input } from "/ui/input.jsx"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

function CreateBudget({ refreshData }) {

    const [emojiIcon, setEmojiIcon] = useState('😊');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const {user}=useUser();

    /**
     * Used to create a new budget
     */
    const onCreateBudget = async () => {
      try {
        const response = await fetch('/api/budgets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            amount: amount,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            icon: emojiIcon
          }),
        });

        const result = await response.json();

        if (result.success) {
          toast('Budget created successfully');
          // Reset form
          setName('');
          setAmount('');
          setEmojiIcon('😊');
          // Refresh the budget list
          if (refreshData) {
            refreshData();
          }
        } else {
          toast('Failed to create budget. Please try again.');
        }
      } catch (error) {
        console.error('Error creating budget:', error);
        toast('Failed to create budget. Please try again.');
      }
    }

    return (
      <Dialog>
      <DialogTrigger asChild>
          <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md'>
              <h2 className='font-bold text-3xl'>+</h2>
              <h2>Create new Budget</h2>
          </div>
      </DialogTrigger>
      <DialogContent>
          <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
              <DialogDescription>
                  <div className='mt-5'>
                      <Button variant='outline' 
                      className='text-lg' 
                      onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>{emojiIcon}</Button>
                      <div className='absolute'>
                         <EmojiPicker open={openEmojiPicker}
                         onEmojiClick={(e)=>{
                          setEmojiIcon(e.emoji)
                          setOpenEmojiPicker(false)
                         }}/>
                      </div>
                      <div className='mt-2'>
                        <h2 className='text-black font-medium'>Budget Name</h2>
                        <Input type='text' placeholder='Enter Budget Name' 
                        onChange={(e)=>setName(e.target.value)}/>
                      </div>
                      <div className='mt-2'>
                        <h2>Budget Amount</h2>
                        <Input type='number' placeholder='e.g. 50000$'
                        onChange={(e)=>setAmount(e.target.value)}/>
                      </div>

                      <Button 
                      disabled={!(name&&amount)}
                      onClick={()=>onCreateBudget()}
                      className='mt-5 w-full text-white'> Create Budget</Button>
                  </div>
              </DialogDescription>
          </DialogHeader>
      </DialogContent>
  </Dialog>
    )
}

export default CreateBudget
